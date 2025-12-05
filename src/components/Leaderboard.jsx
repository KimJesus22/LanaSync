import React, { useMemo } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Crown, Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { isSameMonth, parseISO } from 'date-fns';

const Leaderboard = () => {
    const { users, transactions, budgets, currentMonth } = useFinanzas();

    const ranking = useMemo(() => {
        if (!users.length) return [];

        return users.map(user => {
            // 1. Calculate Total Budget for this user
            const userBudgets = budgets.filter(b => b.user_id === user.id);
            const totalBudget = userBudgets.reduce((acc, curr) => acc + curr.amount_limit, 0);

            // 2. Calculate Total Spend for this user in the current month
            const userTransactions = transactions.filter(t =>
                t.userId === user.id &&
                t.type === 'gasto' &&
                isSameMonth(parseISO(t.date), currentMonth)
            );
            const totalSpent = userTransactions.reduce((acc, curr) => acc + curr.amount, 0);

            // 3. Calculate Score
            // Formula: (Budget - Spent) / Budget * 100
            // If no budget, we can't really calculate this specific metric. 
            // Fallback: If budget is 0, maybe score is 0 or based on raw savings?
            // Let's assume for the game that everyone should have a budget.
            // If budget is 0, score is -100 (penalty for not planning).

            let score = 0;
            if (totalBudget > 0) {
                score = ((totalBudget - totalSpent) / totalBudget) * 100;
            } else if (totalSpent > 0) {
                score = -100; // Spent without budget
            } else {
                score = 0; // No budget, no spend (neutral)
            }

            return {
                ...user,
                score,
                totalBudget,
                totalSpent
            };
        }).sort((a, b) => b.score - a.score); // Sort descending (higher score is better)
    }, [users, transactions, budgets, currentMonth]);

    if (ranking.length === 0) return null;

    const getMedalColor = (index) => {
        switch (index) {
            case 0: return 'text-yellow-400'; // Gold
            case 1: return 'text-gray-300';   // Silver
            case 2: return 'text-amber-600';  // Bronze
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                🏆 Tabla de Clasificación
                <span className="text-xs font-normal text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                    Mensual
                </span>
            </h2>

            <div className="space-y-4">
                {ranking.map((user, index) => {
                    const isWinner = index === 0;
                    const isLoser = index === ranking.length - 1 && ranking.length > 1;

                    return (
                        <div
                            key={user.id}
                            className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${isWinner
                                    ? 'bg-yellow-400/10 border-yellow-400/50 scale-105 shadow-yellow-400/20 shadow-lg z-10'
                                    : 'bg-black/20 border-gray-700 hover:bg-black/40'
                                }`}
                        >
                            {/* Rank */}
                            <div className={`text-2xl font-bold w-8 text-center ${getMedalColor(index)}`}>
                                #{index + 1}
                            </div>

                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl overflow-hidden border-2 border-gray-600">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{user.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                {isWinner && (
                                    <Crown className="absolute -top-4 -right-2 text-yellow-400 w-8 h-8 animate-bounce drop-shadow-lg" fill="currentColor" />
                                )}
                                {isLoser && (
                                    <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1 animate-pulse">
                                        <Wallet className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                                        {user.username || user.email}
                                    </h3>
                                    <span className={`text-lg font-bold ${user.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {user.score.toFixed(1)} pts
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Presupuesto: ${user.totalBudget}</span>
                                    <span>Gastado: ${user.totalSpent}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${user.score >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, Math.max(0, (user.totalSpent / user.totalBudget) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;
