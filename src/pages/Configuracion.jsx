import { Download } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { exportToCSV } from '../lib/utils';
import { Card } from '../components/ui/Card';

const Configuracion = () => {
    const { transactions, currentMonth, users } = useFinanzas();

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
                <h2 className="text-lg font-semibold text-white">Datos y Portabilidad</h2>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-white">Reporte Mensual</h3>
                        <p className="text-xs text-muted">Descarga tus movimientos en CSV</p>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="bg-primary/20 text-primary p-3 rounded-full hover:bg-primary/30 transition-colors"
                    >
                        <Download size={24} />
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
