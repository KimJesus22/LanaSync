import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card } from '../components/ui/Card';
import { Users, Activity, DollarSign, Ban } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0, transactionsToday: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // Fetch Stats
            const statsRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=stats`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch Users
            const usersRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=users`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const usersData = await usersRes.json();
            setUsers(usersData.users || []);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId) => {
        if (!confirm('¿Estás seguro de banear a este usuario?')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=ban`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            alert('Usuario baneado exitosamente');
            fetchData(); // Refresh
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Error al banear usuario');
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Cargando panel de control...</div>;

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard 🛡️</h1>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex items-center gap-4 bg-surface border-none">
                    <div className="bg-blue-500/20 p-4 rounded-full text-blue-500">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Usuarios Totales</p>
                        <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4 bg-surface border-none">
                    <div className="bg-green-500/20 p-4 rounded-full text-green-500">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Grupos Activos</p>
                        <p className="text-2xl font-bold text-white">{stats.totalGroups}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4 bg-surface border-none">
                    <div className="bg-purple-500/20 p-4 rounded-full text-purple-500">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Transacciones Hoy</p>
                        <p className="text-2xl font-bold text-white">{stats.transactionsToday}</p>
                    </div>
                </Card>
            </div>

            {/* Users Table */}
            <div className="bg-surface rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Gestión de Usuarios</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800 text-gray-200 uppercase">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.user_id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{user.user_id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.subscription_status === 'PREMIUM' ? 'bg-green-500/20 text-green-500' :
                                                user.subscription_status === 'BANNED' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.subscription_status || 'FREE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleBan(user.user_id)}
                                            className="text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                                            title="Banear Usuario"
                                        >
                                            <Ban size={16} />
                                            Banear
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
