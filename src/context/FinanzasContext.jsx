import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { fetchTransactions, fetchMembers, addTransaction as apiAddTransaction, deleteTransaction as apiDeleteTransaction, subscribeToTransactions } from '../api';
import { isSameMonth, parseISO, startOfMonth } from 'date-fns';

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
    const [currentUserFilter, setCurrentUserFilter] = useState('all'); // 'all' | userId
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [transactionsData, membersData] = await Promise.all([
                fetchTransactions(),
                fetchMembers()
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
            setLoading(false);
        };

        loadData();

        const unsubscribe = subscribeToTransactions((payload) => {
            if (payload.eventType === 'INSERT') {
                const newT = payload.new;
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
                setTransactions(prev => prev.map(t => {
                    if (t.id === payload.new.id) {
                        const newT = payload.new;
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
    }, []);

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

    // Calcular saldos (GLOBALES, no dependen del mes, excepto para análisis específico, 
    // pero el saldo disponible es acumulativo. 
    // SIN EMBARGO, el requerimiento dice "Dinero Libre" para el mes.
    // Vamos a mantener getBalance como global para saldos totales si fuera una cuenta bancaria,
    // pero para este dashboard de "mes a mes", tal vez queramos ver el flujo del mes.
    // EL USUARIO PIDIO: "Dinero Libre: (Total Ingresos Efectivo) - (Gastos Fijos Obligatorios)"
    // Esto sugiere un cálculo mensual.
    // Pero el saldo de vales es acumulativo ($600 iniciales + lo que sobre).
    // Vamos a hacer que getBalance use las transacciones filtradas (por mes) para reflejar el estado del mes seleccionado.
    // NOTA: Si quisiera saldo histórico real, necesitaría otra lógica, pero para "presupuesto mensual" esto funciona.

    const getBalance = (method) => {
        return filteredTransactions.reduce((acc, curr) => {
            if (curr.paymentMethod !== method) return acc;
            return curr.type === 'ingreso' ? acc + curr.amount : acc - curr.amount;
        }, 0);
    };

    const saldoEfectivo = getBalance('efectivo');
    const saldoVales = getBalance('vales');

    // Calcular gastos por categoría para el dashboard
    const getExpensesByCategory = (categoryName) => {
        return filteredTransactions
            .filter(t => t.type === 'gasto' && t.category === categoryName)
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const addTransaction = async (transaction) => {
        const dbTransaction = {
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            payment_method: transaction.paymentMethod,
            user_id: transaction.userId,
            description: transaction.description,
            date: transaction.date
        };

        try {
            await apiAddTransaction(dbTransaction);
        } catch (error) {
            console.error("Error al agregar transacción:", error);
            alert("Error al guardar la transacción. Verifica tu conexión a internet.");
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await apiDeleteTransaction(id);
        } catch (error) {
            console.error("Error al eliminar transacción:", error);
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
        loading
    };

    return (
        <FinanzasContext.Provider value={value}>
            {children}
        </FinanzasContext.Provider>
    );
};
