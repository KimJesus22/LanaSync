import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import BudgetCard from './BudgetCard';
import { Plus } from 'lucide-react';

const BudgetSection = () => {
    const { budgets, addBudget, deleteBudget, getExpensesByCategory } = useFinanzas();
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const category = formData.get('category');
        const amount = parseFloat(formData.get('amount'));

        if (category && amount) {
            addBudget(category, amount);
            setIsAdding(false);
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Mis Topes</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                >
                    <Plus size={16} /> Nuevo
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-surface p-4 rounded-xl space-y-3 border border-gray-700 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-3">
                        <select name="category" className="bg-background rounded-lg p-2 text-sm text-white border border-gray-700" required>
                            <option value="">Categoría</option>
                            <option value="Ocio">Ocio</option>
                            <option value="Comida">Comida</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Vivienda">Vivienda</option>
                            <option value="Servicios">Servicios</option>
                            <option value="Salud">Salud</option>
                            <option value="Educación">Educación</option>
                            <option value="Ropa">Ropa</option>
                            <option value="Gastos Hormiga">Gastos Hormiga</option>
                            <option value="Otros">Otros</option>
                        </select>
                        <input
                            name="amount"
                            type="number"
                            placeholder="Límite $"
                            className="bg-background rounded-lg p-2 text-sm text-white border border-gray-700"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded-lg text-sm">
                        Guardar Tope
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-3">
                {budgets.map(budget => (
                    <BudgetCard
                        key={budget.id}
                        budget={budget}
                        spent={getExpensesByCategory(budget.category)}
                        onDelete={deleteBudget}
                    />
                ))}
                {budgets.length === 0 && !isAdding && (
                    <p className="text-center text-gray-500 text-sm py-4">
                        No has definido topes de gastos.
                    </p>
                )}
            </div>
        </section>
    );
};

export default BudgetSection;
