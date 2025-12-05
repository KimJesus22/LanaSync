import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinanzas } from '../context/FinanzasContext';
import MonthSelector from '../components/MonthSelector';
import ResumenFinanciero from '../components/ResumenFinanciero';
import RecentTransactions from '../components/RecentTransactions';
import ExpenseChart from '../components/ExpenseChart';
import AddTransactionModal from '../components/AddTransactionModal';
import MotivationalCard from '../components/MotivationalCard';
import BudgetSection from '../components/BudgetSection';

const Dashboard = () => {
    const {
        users,
        currentUserFilter,
        setCurrentUserFilter,
        getExpensesByCategory,
        recurringExpenses,
        transactions,
        addTransaction,
        isOnline,
        pendingTransactions,
        syncNotification
    } = useFinanzas();

    const [showAchievementModal, setShowAchievementModal] = useState(false);
    const [dueExpense, setDueExpense] = useState(null);

    // Check for recurring expenses
    useEffect(() => {
        if (!recurringExpenses || recurringExpenses.length === 0) return;

        const checkDueExpenses = () => {
            const today = new Date();
            const currentDay = today.getDate();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            // Find expenses that are due (day <= today) and NOT paid this month
            const due = recurringExpenses.find(expense => {
                if (expense.day_of_month > currentDay) return false;

                // Check if paid
                const isPaid = transactions.some(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'gasto' &&
                        t.description === expense.name &&
                        tDate.getMonth() === currentMonth &&
                        tDate.getFullYear() === currentYear;
                });

                return !isPaid;
            });

            if (due) {
                setDueExpense(due);
            }
        };

        checkDueExpenses();
    }, [recurringExpenses, transactions]);

    const handlePayExpense = async () => {
        if (!dueExpense) return;

        await addTransaction({
            amount: dueExpense.amount,
            type: 'gasto',
            category: dueExpense.category,
            paymentMethod: 'efectivo', // Default to efectivo, or could ask user
            userId: dueExpense.user_id,
            description: dueExpense.name,
            date: new Date().toISOString()
        });

        setDueExpense(null);
        alert(`¡Pago de ${dueExpense.name} registrado!`);
    };

    useEffect(() => {
        const checkAchievement = () => {
            const today = new Date();
            if (today.getDate() === 30) {
                const ocio = getExpensesByCategory('Ocio');
                const hormiga = getExpensesByCategory('Gastos Hormiga');
                const total = ocio + hormiga;

                if (total < 500) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    setShowAchievementModal(true);
                }
            }
        };

        checkAchievement();
    }, [getExpensesByCategory]);

    return (
        <div className="space-y-4 relative">
            {/* Offline Indicator */}
            {!isOnline && (
                <div className="bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-lg text-center text-sm font-bold animate-pulse flex items-center justify-center gap-2">
                    <span className="text-lg">📡</span>
                    Modo Sin Conexión - {pendingTransactions.length} cambios pendientes
                </div>
            )}

            {/* Sync Notification */}
            {syncNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-[100] animate-in fade-in slide-in-from-top-2 flex items-center gap-2 font-bold">
                    <span>✅</span>
                    {syncNotification}
                </div>
            )}
            <header className="mb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {currentUserFilter === 'all' ? 'Familia' : users.find(u => u.id === currentUserFilter)?.name}
                    </h1>
                    <p className="text-xs text-muted">Resumen Financiero</p>
                </div>

                {/* User Filter */}
                <div className="flex bg-surface rounded-lg p-1">
                    <button
                        onClick={() => setCurrentUserFilter('all')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${currentUserFilter === 'all' ? 'bg-gray-700 text-white' : 'text-muted hover:text-gray-300'}`}
                    >
                        Todos
                    </button>
                    {users.map(user => (
                        <button
                            key={user.id}
                            onClick={() => setCurrentUserFilter(user.id)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${currentUserFilter === user.id ? 'bg-gray-700 text-white' : 'text-muted hover:text-gray-300'}`}
                        >
                            {user.name}
                        </button>
                    ))}
                </div>
            </header>

            <MotivationalCard />

            <MonthSelector />

            <BudgetSection />

            <ResumenFinanciero />

            <RecentTransactions />

            <ExpenseChart />

            <AddTransactionModal />

            {/* Achievement Modal */}
            {showAchievementModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-surface border-2 border-yellow-500 rounded-2xl p-8 max-w-sm text-center animate-in zoom-in duration-300">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-2xl font-bold text-yellow-500 mb-2">¡Logro Desbloqueado!</h2>
                        <h3 className="text-xl font-bold text-white mb-4">Maestro del Ahorro</h3>
                        <p className="text-gray-300 mb-6">
                            Este mes domaste a las hormigas. Tus gastos en Ocio y Hormiga fueron menores a $500.
                        </p>
                        <button
                            onClick={() => setShowAchievementModal(false)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-xl transition-colors"
                        >
                            ¡Genial!
                        </button>
                    </div>
                </div>
            )}

            {/* Recurring Expense Alert Modal */}
            {dueExpense && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-surface border border-primary rounded-2xl p-6 max-w-sm w-full animate-in fade-in duration-300 shadow-2xl shadow-primary/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/20 p-3 rounded-full text-primary">
                                📅
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Gasto Recurrente</h3>
                                <p className="text-xs text-primary">¡Hoy toca pagar!</p>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Hoy es día {dueExpense.day_of_month}. ¿Registrar el pago de <strong>{dueExpense.name}</strong> por <strong>${dueExpense.amount}</strong>?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDueExpense(null)}
                                className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-medium py-2 rounded-lg transition-colors"
                            >
                                Después
                            </button>
                            <button
                                onClick={handlePayExpense}
                                className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold py-2 rounded-lg transition-colors"
                            >
                                Sí, Pagar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
