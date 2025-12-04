import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowUpRight, ArrowDownLeft, Bike, GraduationCap, Smartphone, ShoppingCart, Utensils, Home, HelpCircle } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RecentTransactions = () => {
    const { transactions } = useFinanzas();

    // Obtener las últimas 5 transacciones
    const recentTransactions = transactions.slice(0, 5);

    const getIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'moto': return Bike;
            case 'universidad': return GraduationCap;
            case 'celular': return Smartphone;
            case 'despensa': return ShoppingCart;
            case 'comida': return Utensils;
            case 'casa': return Home;
            default: return HelpCircle;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    if (recentTransactions.length === 0) {
        return (
            <Card className="bg-surface border-none shadow-lg mb-6">
                <CardContent className="p-6 text-center text-muted">
                    No hay transacciones recientes.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-surface border-none shadow-lg mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-white">Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-800">
                    {recentTransactions.map((t) => {
                        const Icon = getIcon(t.category);
                        const isExpense = t.type === 'gasto';

                        return (
                            <div key={t.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isExpense ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{t.category}</p>
                                        <p className="text-xs text-muted capitalize">
                                            {format(new Date(t.date), 'dd MMM', { locale: es })} • {t.description || 'Sin descripción'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`font-bold ${isExpense ? 'text-red-500' : 'text-green-500'}`}>
                                    {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;
