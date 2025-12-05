import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';
import { useFinanzas } from '../context/FinanzasContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

import { Card } from '../components/ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const Estadisticas = () => {
    const { transactions, users, currentMonth } = useFinanzas();

    // 1. Donut Chart Data: Gastos por Categoría
    const categoryData = useMemo(() => {
        const categories = {};
        transactions.forEach(t => {
            if (t.type === 'gasto') {
                categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
            }
        });
        return Object.keys(categories).map(name => ({
            name,
            value: categories[name]
        })).filter(item => item.value > 0);
    }, [transactions]);

    // 2. Stacked Bar Chart Data: Comparativa Familiar (Mes Actual)
    // Agrupado por usuario
    const familyData = useMemo(() => {
        const data = users.map(user => {
            const userExpenses = transactions
                .filter(t => t.userId === user.id && t.type === 'gasto')
                .reduce((acc, curr) => acc + Number(curr.amount), 0);
            return {
                name: user.name,
                gastos: userExpenses
            };
        });
        return data;
    }, [transactions, users]);

    // 3. Line Chart Data: Tendencia de Saldo Acumulado (Mes Actual)
    const trendData = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start, end });



        const data = [];
        let cumulativeBalance = 0;

        for (const day of days) {
            const dayTransactions = transactions.filter(t =>
                isSameDay(parseISO(t.date), day)
            );

            const dayBalance = dayTransactions.reduce((acc, t) => {
                return t.type === 'ingreso' ? acc + Number(t.amount) : acc - Number(t.amount);
            }, 0);

            cumulativeBalance += dayBalance;

            data.push({
                day: format(day, 'd'),
                saldo: cumulativeBalance
            });
        }

        return data;
    }, [transactions, currentMonth]);

    return (
        <div className="space-y-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
                <p className="text-xs text-muted">Visualiza tus finanzas</p>
            </header>

            {/* Gastos por Categoría */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Gastos por Categoría</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `$${value}`}
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Comparativa Familiar */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Gasto Total por Miembro</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={familyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                cursor={{ fill: '#374151', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="gastos" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                                {familyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Tendencia de Saldo */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Tendencia de Saldo (Mes)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="day" stroke="#9ca3af" interval={2} />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="saldo" stroke="#4ade80" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default Estadisticas;
