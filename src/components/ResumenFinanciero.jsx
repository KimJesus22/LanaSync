import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Wallet, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';

const ResumenFinanciero = () => {
    const { saldoEfectivo, saldoDisponibleReal, saldoVales, getExpensesByCategory } = useFinanzas();

    // Vales: $600 iniciales.
    const valesIniciales = 600;
    const porcentajeVales = (saldoVales / valesIniciales) * 100;

    // Estado Deudas Fijas (Moto y Uni)
    const metaUni = 5000;
    const metaMoto = 3200;
    const pagadoUni = getExpensesByCategory('Universidad');
    const pagadoMoto = getExpensesByCategory('Moto');

    const uniPagada = pagadoUni >= metaUni;
    const motoPagada = pagadoMoto >= metaMoto;
    const todasPagadas = uniPagada && motoPagada;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Saldo Efectivo */}
            <Card className="bg-surface border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">
                        Saldo Efectivo
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold ${saldoDisponibleReal < 0 ? 'text-red-500' : 'text-white'}`}>
                        {formatCurrency(saldoDisponibleReal)}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted">
                            Disponible Real
                        </p>
                        <p className="text-[10px] text-gray-500">
                            Total: {formatCurrency(saldoEfectivo)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Saldo Vales */}
            <Card className="bg-surface border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">
                        Saldo Vales
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-end">
                        <div className="text-3xl font-bold text-accent">{formatCurrency(saldoVales)}</div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div
                            className="h-1.5 rounded-full bg-accent"
                            style={{ width: `${Math.max(0, Math.min(100, porcentajeVales))}%` }}
                        ></div>
                    </div>
                </CardContent>
            </Card>

            {/* Estado Deudas Fijas */}
            <Card className="bg-surface border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">
                        Deudas Fijas
                    </CardTitle>
                    {todasPagadas ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className={uniPagada ? 'text-green-500 line-through' : 'text-white'}>Universidad</span>
                            <span className="text-muted">{uniPagada ? 'Pagado' : 'Pendiente'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className={motoPagada ? 'text-green-500 line-through' : 'text-white'}>Moto</span>
                            <span className="text-muted">{motoPagada ? 'Pagado' : 'Pendiente'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResumenFinanciero;
