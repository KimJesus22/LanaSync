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

const Dashboard = () => {
    const {
        users,
        currentUserFilter,
        setCurrentUserFilter,
        getExpensesByCategory
    } = useFinanzas();

    const [showAchievementModal, setShowAchievementModal] = useState(false);

    useEffect(() => {
        const checkAchievement = () => {
            const today = new Date();
            // Check if it's the 30th of the month (or later, to be safe, but requirement says day 30)
            // Let's check if it is the 30th day of the current month being viewed? 
            // Or the actual current date? Usually achievements are based on real time.
            // Requirement: "Si estamos a día 30 del mes"

            if (today.getDate() === 30) {
                const ocio = getExpensesByCategory('Ocio');
                const hormiga = getExpensesByCategory('Gastos Hormiga'); // Assuming this category exists or will exist
                const total = ocio + hormiga;

                if (total < 500) {
                    // Trigger confetti
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
    }, [getExpensesByCategory]); // Re-run if expenses change

    return (
        <div className="space-y-4 relative">
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

        </div>
    );
};

export default Dashboard;
