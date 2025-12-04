import { Card, CardContent } from './ui/Card';
import { CheckCircle2, Circle, GraduationCap, Bike, Smartphone } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';

const ProximosPagos = () => {
    const { getExpensesByCategory } = useFinanzas();

    const pagosFijos = [
        {
            id: 1,
            name: 'Universidad',
            icon: GraduationCap,
            target: 5000,
            paid: getExpensesByCategory('Universidad'),
            color: 'text-blue-500'
        },
        {
            id: 2,
            name: 'Moto',
            icon: Bike,
            target: 3200,
            paid: getExpensesByCategory('Moto'),
            color: 'text-orange-500'
        },
        {
            id: 3,
            name: 'Celular',
            icon: Smartphone,
            target: 500, // Estimado
            paid: getExpensesByCategory('Celular'),
            color: 'text-purple-500'
        }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-white">Pagos del Mes</h3>
            {pagosFijos.map((pago) => {
                const isPaid = pago.paid >= pago.target;
                const Icon = pago.icon;

                return (
                    <Card key={pago.id} className={`border-none ${isPaid ? 'bg-green-900/20' : 'bg-surface'}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-gray-800 ${isPaid ? 'text-green-500' : pago.color}`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className={`font-medium ${isPaid ? 'text-green-500' : 'text-white'}`}>{pago.name}</p>
                                    <p className="text-xs text-muted">
                                        {formatCurrency(pago.paid)} / {formatCurrency(pago.target)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {isPaid ? (
                                    <CheckCircle2 className="text-green-500" size={24} />
                                ) : (
                                    <Circle className="text-gray-600" size={24} />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default ProximosPagos;
