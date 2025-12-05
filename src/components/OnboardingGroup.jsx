import React, { useState } from 'react';
import { createGroup, joinGroup } from '../api';
import { Users, Plus, LogIn } from 'lucide-react';

const OnboardingGroup = ({ userId, onGroupJoined }) => {
    const [mode, setMode] = useState('initial'); // initial, create, join
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const group = await createGroup(groupName, userId);
            onGroupJoined(group);
        } catch (err) {
            console.error(err);
            setError('Error al crear el grupo. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const group = await joinGroup(inviteCode, userId);
            onGroupJoined(group);
        } catch (err) {
            console.error(err);
            setError('Código inválido o error al unirse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-primary/20 p-4 rounded-full">
                        <Users className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a Finanzas</h1>
                <p className="text-gray-400 mb-8">Para comenzar, necesitas pertenecer a un grupo familiar o de equipo.</p>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {mode === 'initial' && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('create')}
                            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105"
                        >
                            <Plus className="w-6 h-6" />
                            Crear Nuevo Grupo
                        </button>
                        <button
                            onClick={() => setMode('join')}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all border border-gray-600"
                        >
                            <LogIn className="w-6 h-6" />
                            Unirme con Código
                        </button>
                    </div>
                )}

                {mode === 'create' && (
                    <form onSubmit={handleCreate} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-left">
                            <label className="text-sm text-gray-400 mb-1 block">Nombre del Grupo</label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Ej. Familia Gómez"
                                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setMode('initial')}
                                className="flex-1 bg-transparent text-gray-400 hover:text-white py-3 font-medium"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creando...' : 'Crear Grupo'}
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'join' && (
                    <form onSubmit={handleJoin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-left">
                            <label className="text-sm text-gray-400 mb-1 block">Código de Invitación</label>
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="Ej. A1B2C3"
                                className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none uppercase tracking-widest text-center font-mono"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setMode('initial')}
                                className="flex-1 bg-transparent text-gray-400 hover:text-white py-3 font-medium"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Uniéndose...' : 'Unirse'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OnboardingGroup;
