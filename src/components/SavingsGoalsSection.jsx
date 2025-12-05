import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import SavingsGoalCard from './SavingsGoalCard';

const SavingsGoalsSection = () => {
    const { savingsGoals, addSavingsGoal } = useFinanzas();
    const [isAdding, setIsAdding] = useState(false);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');

    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (!newGoalName || !newGoalTarget) return;

        await addSavingsGoal(newGoalName, parseFloat(newGoalTarget));
        setNewGoalName('');
        setNewGoalTarget('');
        setIsAdding(false);
    };

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🏺 Mis Metas (Urnas)
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                    {isAdding ? 'Cancelar' : '+ Nueva Meta'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddGoal} className="bg-surface p-4 rounded-xl border border-gray-700 mb-4 animate-in slide-in-from-top-2">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Nombre de la meta (ej. Viaje)"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            className="flex-1 bg-black/30 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                        />
                        <input
                            type="number"
                            placeholder="Meta ($)"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            className="w-24 bg-black/30 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-black font-bold py-2 rounded hover:bg-primary/90"
                    >
                        Crear Urna
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savingsGoals.map(goal => (
                    <SavingsGoalCard key={goal.id} goal={goal} />
                ))}

                {savingsGoals.length === 0 && !isAdding && (
                    <div className="col-span-full text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-xl">
                        <p>No tienes metas activas.</p>
                        <button onClick={() => setIsAdding(true)} className="text-primary mt-2 text-sm">
                            Crear mi primera urna
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SavingsGoalsSection;
