import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFinanzas } from '../context/FinanzasContext';

const MonthSelector = () => {
    const { currentMonth, setCurrentMonth } = useFinanzas();

    const handlePrevMonth = () => {
        setCurrentMonth(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => addMonths(prev, 1));
    };

    return (
        <div className="flex items-center justify-between bg-surface rounded-lg p-2 mb-4">
            <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
                <ChevronLeft size={20} />
            </button>

            <span className="text-lg font-medium capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </span>

            <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default MonthSelector;
