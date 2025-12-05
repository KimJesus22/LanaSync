import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { fetchTransactions, fetchMembers, addTransaction as apiAddTransaction, deleteTransaction as apiDeleteTransaction, subscribeToTransactions } from '../api';
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
    const [currentUserFilter, setCurrentUserFilter] = useState('all'); // 'all' | userId
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

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
                setLoading(false);
                return;
            }

            setLoading(true);
            const [transactionsData, membersData] = await Promise.all([
                fetchTransactions(),
                fetchMembers()
            ]);

            // Filtrar transacciones por usuario autenticado (aunque RLS debería encargarse, esto es doble seguridad/conveniencia)
            // Asumimos que fetchTransactions ya trae todo lo que el usuario PUEDE ver (gracias a RLS)
            // Pero necesitamos mapear los campos correctamente
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

            // Filtrar miembros para mostrar solo el del usuario actual (o todos si es compartido, pero por ahora personal)
            // Si queremos que sea multi-usuario real, deberíamos ver todos los miembros de la "familia" o grupo.
            // Por ahora, el requerimiento dice "Vincula la tabla members con auth.users".
            // Vamos a mostrar el miembro asociado a este usuario.
            const userMember = membersData.find(m => m.user_id === session.user.id);
            // Si no existe miembro, tal vez el trigger falló o es el primer login antes del trigger?
            // El trigger debería crearlo.

            setTransactions(formattedData);
            setUsers(membersData); // Mostramos todos los miembros que RLS permita ver (el propio)
            setLoading(false);
        };

        loadData();

        if (!session?.user) return;

        const unsubscribe = subscribeToTransactions((payload) => {
            // Solo procesar si pertenece al usuario (aunque el canal podría filtrar, mejor asegurar)
            // Nota: payload.new.user_id podría no estar disponible en DELETE

            if (payload.eventType === 'INSERT') {
                const newT = payload.new;
                if (newT.user_id !== session.user.id) return; // Ignorar si no es mío

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

        // Filtro por usuario (ahora redundante si solo cargamos los del usuario, pero útil si hay múltiples miembros en una cuenta)
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
            user_id: session.user.id, // Usar ID de sesión
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
        loading,
        session // Exportar sesión
    };

    return (
        <FinanzasContext.Provider value={value}>
            {children}
        </FinanzasContext.Provider>
    );
};
