import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';

const SavingsGoalCard = ({ goal }) => {
    const { transferToGoal, deleteSavingsGoal } = useFinanzas();
    const [transferAmount, setTransferAmount] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);

    const percentage = Math.min(100, (goal.current_amount / goal.target_amount) * 100);

    // Circular Progress Logic
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) return;

        await transferToGoal(goal.id, transferAmount);
        setTransferAmount('');
        setIsTransferring(false);
    };

    return (
        <div className="bg-surface p-4 rounded-xl border border-gray-700 relative group">
            <button
                onClick={() => deleteSavingsGoal(goal.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                🗑️
            </button>

            <div className="flex items-center gap-4">
                {/* Circular Progress */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-700"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="text-primary transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {percentage.toFixed(0)}%
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{goal.name}</h3>
                    <p className="text-sm text-gray-400">
                        ${goal.current_amount} / ${goal.target_amount}
                    </p>

                    {!isTransferring ? (
                        <button
                            onClick={() => setIsTransferring(true)}
                            className="mt-2 text-xs bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1 rounded-full transition-colors"
                        >
                            + Agregar Fondos
                        </button>
                    ) : (
                        <form onSubmit={handleTransfer} className="mt-2 flex gap-2">
                            <input
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="$"
                                className="w-16 bg-black/30 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="text-xs bg-primary text-black px-2 py-1 rounded hover:bg-primary/90"
                            >
                                OK
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsTransferring(false)}
                                className="text-xs text-gray-400 hover:text-white"
                            >
                                X
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavingsGoalCard;
