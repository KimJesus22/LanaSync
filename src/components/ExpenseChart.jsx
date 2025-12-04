import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinanzas } from '../context/FinanzasContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4D4D'];

const ExpenseChart = () => {
    const { transactions, users } = useFinanzas();

    // Filtrar solo gastos
    const gastos = transactions.filter(t => t.type === 'gasto');

    // Agrupar por categoría
    const gastosPorCategoria = gastos.reduce((acc, curr) => {
        if (!acc[curr.category]) {
            acc[curr.category] = 0;
        }
        acc[curr.category] += curr.amount;
        return acc;
    }, {});

    const data = Object.keys(gastosPorCategoria).map(cat => ({
        name: cat,
        value: gastosPorCategoria[cat]
    }));

    if (data.length === 0) {
        return (
            <div className="text-center text-muted py-8">
                No hay gastos registrados este mes.
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl p-4 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Distribución de Gastos</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)}
                            contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExpenseChart;
