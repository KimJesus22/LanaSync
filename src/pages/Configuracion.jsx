import { useFinanzas } from '../context/FinanzasContext';
import { exportToCSV } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, Users, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { supabase } from '../supabaseClient';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MonthlyReport from '../components/MonthlyReport';

const Configuracion = () => {
    const {
        transactions,
        currentMonth,
        users,
        recurringExpenses,
        addRecurringExpense,
        deleteRecurringExpense,
        userGroup,
        subscriptionStatus
    } = useFinanzas();
    const navigate = useNavigate();

    // Calculate totals for the report
    const totalIncome = transactions
        .filter(t => t.type === 'ingreso')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'gasto')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const handleDownload = () => {
        exportToCSV(transactions, currentMonth, users);
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Configuración</h1>
                <p className="text-xs text-muted">Ajustes y herramientas</p>
            </header>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Gestión de Grupos</h2>
                <Card className="p-4 flex items-center justify-between bg-surface border-none shadow-lg">
                    <div>
                        <h3 className="font-medium text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            {userGroup?.name || 'Sin Grupo'}
                        </h3>
                        <p className="text-xs text-muted">
                            Plan: <span className={subscriptionStatus === 'PREMIUM' ? 'text-accent font-bold' : 'text-gray-400'}>{subscriptionStatus}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (subscriptionStatus !== 'PREMIUM') {
                                navigate('/pricing');
                            } else {
                                alert('Funcionalidad de múltiples grupos próximamente.');
                            }
                        }}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Grupo
                    </button>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Datos y Portabilidad</h2>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white">Reporte Mensual</h3>
                        <p className="text-xs text-muted">Descarga tus movimientos en CSV</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownload}
                            className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
                            title="Descargar CSV"
                        >
                            <Download size={24} />
                        </button>

                        <PDFDownloadLink
                            document={
                                <MonthlyReport
                                    transactions={transactions}
                                    currentMonth={currentMonth}
                                    income={totalIncome}
                                    expenses={totalExpenses}
                                    quote="El ahorro no es solo guardar dinero, es guardar libertad."
                                />
                            }
                            fileName={`reporte_mensual_${currentMonth.toISOString().slice(0, 7)}.pdf`}
                            className="bg-primary/20 text-primary p-3 rounded-full hover:bg-primary/30 transition-colors flex items-center justify-center"
                            title="Descargar PDF"
                        >
                            {({ loading }) =>
                                loading ? '...' : <FileText size={24} />
                            }
                        </PDFDownloadLink>
                    </div>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Gastos Recurrentes</h2>
                <p className="text-xs text-muted">La app te recordará estos pagos.</p>

                <div className="space-y-3">
                    {recurringExpenses.map(expense => (
                        <Card key={expense.id} className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">{expense.name}</h3>
                                <p className="text-xs text-muted">
                                    ${expense.amount} • Día {expense.day_of_month} • {expense.category}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteRecurringExpense(expense.id)}
                                className="text-red-400 hover:text-red-300 p-2"
                            >
                                ✕
                            </button>
                        </Card>
                    ))}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        addRecurringExpense({
                            name: formData.get('name'),
                            amount: parseFloat(formData.get('amount')),
                            day_of_month: parseInt(formData.get('day')),
                            category: formData.get('category'),
                            user_id: users[0]?.id || 'user-1' // Default to first user for now
                        });
                        e.target.reset();
                    }}
                    className="bg-surface p-4 rounded-xl space-y-3 border border-gray-700"
                >
                    <h3 className="text-sm font-medium text-white">Nuevo Gasto Recurrente</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input name="name" placeholder="Nombre (ej: Netflix)" required className="bg-background rounded-lg p-2 text-sm text-white border border-gray-700" />
                        <input name="amount" type="number" placeholder="Monto" required className="bg-background rounded-lg p-2 text-sm text-white border border-gray-700" />
                        <input name="day" type="number" min="1" max="31" placeholder="Día del mes" required className="bg-background rounded-lg p-2 text-sm text-white border border-gray-700" />
                        <select name="category" className="bg-background rounded-lg p-2 text-sm text-white border border-gray-700">
                            <option value="Servicios">Servicios</option>
                            <option value="Vivienda">Vivienda</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Ocio">Ocio</option>
                            <option value="Educación">Educación</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded-lg text-sm">
                        Agregar
                    </button>
                </form>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Cuenta</h2>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white">Sesión</h3>
                        <p className="text-xs text-muted">Cerrar sesión en este dispositivo</p>
                    </div>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.reload();
                        }}
                        className="bg-red-500/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                    >
                        Cerrar Sesión
                    </button>
                </Card>
            </section>

            <div className="text-center text-xs text-muted mt-8">
                <p>LanaSync v1.0.0</p>
            </div>
        </div>
    );
};

export default Configuracion;
