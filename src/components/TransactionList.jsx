import { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Bike, GraduationCap, Smartphone, ShoppingCart, Utensils, Home, HelpCircle,
    Trash2, TrendingUp, TrendingDown
} from 'lucide-react';
import { Card, CardContent } from './ui/Card';

const TransactionList = () => {
    const { transactions, deleteTransaction } = useFinanzas();
    const [filter, setFilter] = useState('all'); // 'all', 'ingreso', 'gasto'

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

    const getColor = (category) => {
        switch (category.toLowerCase()) {
            case 'moto': return 'bg-blue-500';
            case 'universidad': return 'bg-indigo-500';
            case 'celular': return 'bg-cyan-500';
            case 'comida': return 'bg-orange-500';
            case 'transporte': return 'bg-yellow-500';
            case 'ocio': return 'bg-pink-500';
            default: return 'bg-gray-500';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
            await deleteTransaction(id);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex bg-surface rounded-lg p-1 mb-4">
                {['all', 'ingreso', 'gasto'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize ${filter === f
                                ? 'bg-gray-700 text-white shadow-sm'
                                : 'text-muted hover:text-gray-300'
                            }`}
                    >
                        {f === 'all' ? 'Todo' : f + 's'}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center text-muted py-8">
                        No hay movimientos registrados.
                    </div>
                ) : (
                    filteredTransactions.map((t) => {
                        const Icon = getIcon(t.category);
                        const isExpense = t.type === 'gasto';
                        const isVales = t.paymentMethod === 'vales';
                        const iconBg = getColor(t.category);

                        return (
                            <Card key={t.id} className="bg-surface border-none shadow-sm hover:bg-gray-800/50 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                    {/* Left: Icon & Details */}
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${iconBg} bg-opacity-20 text-white`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{t.description || t.category}</h4>
                                            <p className="text-xs text-muted capitalize">
                                                {format(new Date(t.date), 'dd MMM', { locale: es })} • {t.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Amount & Actions */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`font-bold text-lg ${isVales ? 'text-accent' : (isExpense ? 'text-white' : 'text-green-500')
                                                }`}>
                                                {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                                            </div>
                                            {isVales && (
                                                <span className="text-[10px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase">
                                                    VALE
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="p-2 text-red-400/50 hover:text-red-500 hover:bg-red-900/20 rounded-full transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TransactionList;
