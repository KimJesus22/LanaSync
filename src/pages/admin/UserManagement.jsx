import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Shield, User } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const { error } = await supabase
                .from('members')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Error al actualizar rol');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                <span className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg border border-gray-700">
                    Total: {users.length}
                </span>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-400">
                        <tr>
                            <th className="p-4 font-medium">Usuario</th>
                            <th className="p-4 font-medium">Rol</th>
                            <th className="p-4 font-medium">Fecha Registro</th>
                            <th className="p-4 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                            style={{ backgroundColor: user.color || '#6B7280' }}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                            : 'bg-gray-700 text-gray-300'
                                        }`}>
                                        {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleRole(user.id, user.role)}
                                        className="text-sm text-blue-400 hover:text-blue-300 mr-4"
                                    >
                                        Cambiar Rol
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
