import React from 'react';
import { Card } from './ui/Card';
import { Trash2 } from 'lucide-react';

const BudgetCard = ({ budget, spent, onDelete }) => {
    const percentage = Math.min((spent / budget.amount_limit) * 100, 100);
    const isOverLimit = spent > budget.amount_limit;

    let colorClass = 'bg-green-500';
    if (percentage > 80) {
        colorClass = 'bg-red-500';
    } else if (percentage > 50) {
        colorClass = 'bg-yellow-500';
    }

    return (
        <Card className={`p-4 relative overflow-hidden ${isOverLimit ? 'animate-pulse ring-2 ring-red-500/50' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-white">{budget.category}</h3>
                    <p className="text-xs text-gray-400">
                        ${spent.toFixed(0)} / ${budget.amount_limit}
                    </p>
                </div>
                <button
                    onClick={() => onDelete(budget.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {isOverLimit && (
                <div className="absolute inset-0 bg-red-500/10 pointer-events-none animate-pulse" />
            )}
        </Card>
    );
};

export default BudgetCard;
