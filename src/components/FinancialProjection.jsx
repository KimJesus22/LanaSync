import React, { useMemo } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { getDaysInMonth, getDate } from 'date-fns';

const FinancialProjection = () => {
    const { transactions, recurringExpenses, currentMonth } = useFinanzas();

    const projectionData = useMemo(() => {
        const today = new Date();
        const daysInMonth = getDaysInMonth(currentMonth);
        // If we are looking at a past month, use all days. If current month, use today's date.
        // But usually projection is useful for CURRENT month.
        // Let's assume current month context.
        const currentDay = getDate(today);

        // 1. Calculate Income
        const totalIncome = transactions
            .filter(t => t.type === 'ingreso')
            .reduce((acc, t) => acc + t.amount, 0);

        // 2. Calculate Fixed Expenses (Recurring)
        // We assume recurringExpenses contains ALL fixed expenses for the month
        const totalFixed = recurringExpenses.reduce((acc, e) => acc + e.amount, 0);

        // 3. Calculate Variable Expenses (Actual spent so far)
        // We filter out transactions that match recurring expenses to avoid double counting 
        // or skewing the daily average if a fixed expense is paid early.
        // A simple heuristic is: if description matches a recurring expense name.
        const variableTransactions = transactions.filter(t => {
            if (t.type !== 'gasto') return false;
            const isRecurring = recurringExpenses.some(re => re.name === t.description);
            return !isRecurring;
        });

        const totalVariableSpent = variableTransactions.reduce((acc, t) => acc + t.amount, 0);

        // 4. Calculate Daily Average (Variable)
        // Avoid division by zero
        const effectiveDay = Math.max(1, currentDay);
        const dailyAverage = totalVariableSpent / effectiveDay;

        // 5. Project Variable Expenses
        const projectedVariable = dailyAverage * daysInMonth;

        // 6. Total Projected Spend
        const totalProjectedSpend = totalFixed + projectedVariable;

        // 7. Analysis
        const disposableIncome = totalIncome - totalFixed;
        const projectedBalance = disposableIncome - projectedVariable;

        return {
            dailyAverage,
            projectedVariable,
            totalProjectedSpend,
            projectedBalance,
            isDanger: projectedBalance < 0,
            daysInMonth,
            currentDay
        };
    }, [transactions, recurringExpenses, currentMonth]);

    // Only show if there is some data to project
    if (transactions.length === 0 && recurringExpenses.length === 0) return null;

    const {
        dailyAverage,
        projectedVariable,
        projectedBalance,
        isDanger
    } = projectionData;

    return (
        <div className={`p-6 rounded-2xl border-2 shadow-lg mb-6 animate-in fade-in slide-in-from-bottom-4 ${isDanger
                ? 'bg-red-900/20 border-red-500/50'
                : 'bg-green-900/20 border-green-500/50'
            }`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDanger ? 'text-red-400' : 'text-green-400'
                }`}>
                {isDanger ? '⚠️ Alerta Financiera' : '✅ Proyección Positiva'}
            </h3>

            <div className="space-y-4">
                <div>
                    <p className="text-gray-400 text-sm mb-1">Gasto Promedio Diario (Variable)</p>
                    <p className="text-2xl font-bold text-white">
                        ${dailyAverage.toFixed(2)}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm">
                    {isDanger ? (
                        <>
                            <p className="text-red-300 font-medium text-lg mb-1">
                                ⚠️ A este ritmo, te faltarán:
                            </p>
                            <p className="text-3xl font-black text-red-500">
                                ${Math.abs(projectedBalance).toFixed(2)}
                            </p>
                            <p className="text-xs text-red-400/80 mt-2">
                                Proyección de gasto variable: ${projectedVariable.toFixed(2)}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-green-300 font-medium text-lg mb-1">
                                ✅ Vas bien, te sobrarán aprox:
                            </p>
                            <p className="text-3xl font-black text-green-500">
                                ${projectedBalance.toFixed(2)}
                            </p>
                            <p className="text-xs text-green-400/80 mt-2">
                                Manteniendo tu promedio de ${dailyAverage.toFixed(0)}/día
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialProjection;
