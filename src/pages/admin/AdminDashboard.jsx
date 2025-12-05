import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Activity } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">{title}</h3>
            <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTransactions: 0,
        totalRevenue: 0, // Mocked for now as we don't have real payments yet
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { count: userCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
                const { count: txCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true });

                setStats({
                    totalUsers: userCount || 0,
                    totalTransactions: txCount || 0,
                    totalRevenue: (userCount || 0) * 9, // Mock revenue: $9 * users
                });
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner />;

    const chartData = [
        { name: 'Ene', users: 4 },
        { name: 'Feb', users: 7 },
        { name: 'Mar', users: 12 },
        { name: 'Abr', users: stats.totalUsers },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Dashboard General</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Usuarios Totales" value={stats.totalUsers} icon={Users} color="blue" />
                <StatCard title="Transacciones" value={stats.totalTransactions} icon={Activity} color="purple" />
                <StatCard title="Ingresos Estimados" value={`$${stats.totalRevenue}`} icon={DollarSign} color="emerald" />
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">Crecimiento de Usuarios</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                itemStyle={{ color: '#F3F4F6' }}
                            />
                            <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
