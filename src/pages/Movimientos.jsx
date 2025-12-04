import TransactionList from '../components/TransactionList';
import MonthSelector from '../components/MonthSelector';

const Movimientos = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white mb-4">Historial</h1>
            <MonthSelector />
            <TransactionList />
        </div>
    );
};

export default Movimientos;
