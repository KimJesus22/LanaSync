import { useState } from 'react';
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

    const [paymentModal, setPaymentModal] = useState({ open: false, debt: '', amount: '', date: new Date().toISOString().split('T')[0] });
    const { addTransaction } = useFinanzas();

    const handleOpenPayment = (debt, currentAmount, meta) => {
        const remaining = Math.max(0, meta - currentAmount);
        setPaymentModal({
            open: true,
            debt,
            amount: remaining.toString(),
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        if (!paymentModal.amount || !paymentModal.date) return;

        await addTransaction({
            amount: parseFloat(paymentModal.amount),
            category: paymentModal.debt,
            date: new Date(paymentModal.date).toISOString(),
            description: `Pago ${paymentModal.debt}`,
            type: 'gasto',
            paymentMethod: 'efectivo' // Defaulting to efectivo as per plan
        });

        setPaymentModal({ ...paymentModal, open: false });
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
            <Card className="bg-surface border-none shadow-lg relative">
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
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className={uniPagada ? 'text-green-500 line-through' : 'text-white'}>Universidad</span>
                            {uniPagada ? (
                                <span className="text-green-500 text-xs font-bold">Pagado</span>
                            ) : (
                                <button
                                    onClick={() => handleOpenPayment('Universidad', pagadoUni, metaUni)}
                                    className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1 rounded-full text-xs transition-colors"
                                >
                                    Pagar
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className={motoPagada ? 'text-green-500 line-through' : 'text-white'}>Moto</span>
                            {motoPagada ? (
                                <span className="text-green-500 text-xs font-bold">Pagado</span>
                            ) : (
                                <button
                                    onClick={() => handleOpenPayment('Moto', pagadoMoto, metaMoto)}
                                    className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1 rounded-full text-xs transition-colors"
                                >
                                    Pagar
                                </button>
                            )}
                        </div>
                    </div>
                </CardContent>

                {/* Payment Modal */}
                {paymentModal.open && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center p-4">
                        <form onSubmit={handleConfirmPayment} className="w-full space-y-3">
                            <h3 className="text-white font-bold text-center mb-2">Pagar {paymentModal.debt}</h3>

                            <div>
                                <label className="text-xs text-muted block mb-1">Monto</label>
                                <input
                                    type="number"
                                    value={paymentModal.amount}
                                    onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                                    className="w-full bg-gray-800 rounded-lg p-2 text-white text-sm border border-gray-700"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted block mb-1">Fecha</label>
                                <input
                                    type="date"
                                    value={paymentModal.date}
                                    onChange={(e) => setPaymentModal({ ...paymentModal, date: e.target.value })}
                                    className="w-full bg-gray-800 rounded-lg p-2 text-white text-sm border border-gray-700"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPaymentModal({ ...paymentModal, open: false })}
                                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-black font-bold py-2 rounded-lg text-xs"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ResumenFinanciero;
