import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
    fetchTransactions,
    fetchMembers,
    addTransaction as apiAddTransaction,
    deleteTransaction as apiDeleteTransaction,
    subscribeToTransactions,
    fetchBudgets,
    addBudget as apiAddBudget,
    deleteBudget as apiDeleteBudget,
    fetchRecurringExpenses,
    addRecurringExpense as apiAddRecurringExpense,
    deleteRecurringExpense as apiDeleteRecurringExpense
} from '../api';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { supabase } from '../supabaseClient';

const FinanzasContext = createContext();

export const useFinanzas = () => {
    const context = useContext(FinanzasContext);
    if (!context) {
        throw new Error('useFinanzas debe ser usado dentro de un FinanzasProvider');
    }
    return context;
};

export const FinanzasProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [currentUserFilter, setCurrentUserFilter] = useState('all'); // 'all' | userId
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    const { isOnline, pendingTransactions, addOfflineTransaction, syncNotification } = useOfflineSync();

    // Manejar sesión de Supabase
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            if (!session?.user) {
                setTransactions([]);
                setUsers([]);
                setBudgets([]);
                setRecurringExpenses([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const [transactionsData, membersData, budgetsData, recurringData] = await Promise.all([
                fetchTransactions(),
                fetchMembers(),
                fetchBudgets(),
                fetchRecurringExpenses()
            ]);

            const formattedData = transactionsData.map(t => ({
                id: t.id,
                date: t.created_at,
                amount: t.amount,
                type: t.type,
                category: t.category,
                paymentMethod: t.payment_method,
                userId: t.user_id,
                description: t.description
            }));

            setTransactions(formattedData);
            setUsers(membersData);
            setBudgets(budgetsData);
            setRecurringExpenses(recurringData);
            setLoading(false);
        };

        loadData();

        if (!session?.user) return;

        const unsubscribe = subscribeToTransactions((payload) => {
            if (payload.eventType === 'INSERT') {
                const newT = payload.new;
                if (newT.user_id !== session.user.id) return;

                const formattedT = {
                    id: newT.id,
                    date: newT.created_at,
                    amount: newT.amount,
                    type: newT.type,
                    category: newT.category,
                    paymentMethod: newT.payment_method,
                    userId: newT.user_id,
                    description: newT.description
                };
                setTransactions(prev => [formattedT, ...prev]);
            } else if (payload.eventType === 'DELETE') {
                setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
                const newT = payload.new;
                if (newT.user_id !== session.user.id) return;

                setTransactions(prev => prev.map(t => {
                    if (t.id === payload.new.id) {
                        return {
                            id: newT.id,
                            date: newT.created_at,
                            amount: newT.amount,
                            type: newT.type,
                            category: newT.category,
                            paymentMethod: newT.payment_method,
                            userId: newT.user_id,
                            description: newT.description
                        };
                    }
                    return t;
                }));
            }
        });

        return () => {
            unsubscribe();
        };
    }, [session]);

    // Filtrar transacciones según el usuario seleccionado y el mes actual
    const filteredTransactions = useMemo(() => {
        let filtered = transactions;

        // Filtro por mes
        filtered = filtered.filter(t => isSameMonth(parseISO(t.date), currentMonth));

        // Filtro por usuario
        if (currentUserFilter !== 'all') {
            filtered = filtered.filter(t => t.userId === currentUserFilter);
        }

        return filtered;
    }, [transactions, currentUserFilter, currentMonth]);

    const getBalance = (method) => {
        return filteredTransactions.reduce((acc, curr) => {
            if (curr.paymentMethod !== method) return acc;
            return curr.type === 'ingreso' ? acc + curr.amount : acc - curr.amount;
        }, 0);
    };

    const saldoEfectivo = getBalance('efectivo');
    const saldoVales = getBalance('vales');

    const getExpensesByCategory = (categoryName) => {
        return filteredTransactions
            .filter(t => t.type === 'gasto' && t.category === categoryName)
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const addTransaction = async (transaction) => {
        if (!session?.user) {
            alert("Debes iniciar sesión para agregar transacciones.");
            return;
        }

        const dbTransaction = {
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            payment_method: transaction.paymentMethod,
            user_id: session.user.id,
            description: transaction.description,
            date: transaction.date
        };

        try {
            const result = await addOfflineTransaction(dbTransaction);
            if (result?.offline) {
                // Optional: Optimistically update UI or just rely on the pending indicator
                // For now, we rely on the indicator as per requirements
                // But we can alert the user
                // alert("Guardado en modo sin conexión"); 
                // The requirement says: "Si navigator.onLine es false, guarda la transacción en localStorage... Muestra un indicador visual..."
                // It doesn't say show an alert.
            }
        } catch (error) {
            console.error("Error al agregar transacción:", error);
            alert("Error al guardar la transacción.");
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await apiDeleteTransaction(id);
        } catch (error) {
            console.error("Error al eliminar transacción:", error);
        }
    };

    // Budget Functions
    const addBudget = async (category, amount) => {
        if (!session?.user) return;
        try {
            const newBudget = await apiAddBudget({
                category,
                amount_limit: amount,
                user_id: session.user.id
            });
            setBudgets(prev => [...prev, newBudget]);
        } catch (error) {
            console.error("Error adding budget:", error);
            alert("Error al guardar el presupuesto.");
        }
    };

    const deleteBudget = async (id) => {
        try {
            await apiDeleteBudget(id);
            setBudgets(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    };

    // Recurring Expenses Functions
    const addRecurringExpense = async (expense) => {
        if (!session?.user) return;
        try {
            const newExpense = await apiAddRecurringExpense({
                ...expense,
                user_id: session.user.id
            });
            setRecurringExpenses(prev => [...prev, newExpense]);
        } catch (error) {
            console.error("Error adding recurring expense:", error);
            alert("Error al guardar el gasto recurrente.");
        }
    };

    const deleteRecurringExpense = async (id) => {
        try {
            await apiDeleteRecurringExpense(id);
            setRecurringExpenses(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error("Error deleting recurring expense:", error);
        }
    };

    const value = {
        users,
        transactions: filteredTransactions,
        currentUserFilter,
        setCurrentUserFilter,
        currentMonth,
        setCurrentMonth,
        saldoEfectivo,
        saldoVales,
        addTransaction,
        deleteTransaction,
        getExpensesByCategory,
        loading,
        session,
        budgets,
        addBudget,
        deleteBudget,
        recurringExpenses,
        addRecurringExpense,
        addRecurringExpense,
        deleteRecurringExpense,
        isOnline,
        pendingTransactions,
        syncNotification
    };

    return (
        <FinanzasContext.Provider value={value}>
            {children}
        </FinanzasContext.Provider>
    );
};
