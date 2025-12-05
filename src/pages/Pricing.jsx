import React, { useState } from 'react';
import { Check, X, Zap, Crown } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { supabase } from '../supabaseClient';

const Pricing = () => {
    const { subscriptionStatus, session } = useFinanzas();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const { data: { session: currentSession } } = await supabase.auth.getSession();

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentSession.access_token}`
                },
                body: JSON.stringify({
                    price_id: 'price_1234567890', // Placeholder Price ID
                    user_id: session.user.id,
                    return_url: window.location.origin
                })
            });

            const { url, error } = await response.json();
            if (error) throw new Error(error);
            if (url) window.location.href = url;

        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('Error al iniciar el pago. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const isPro = subscriptionStatus === 'PREMIUM';

    return (
        <div className="min-h-screen bg-background text-white p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Mejora tu Experiencia
                </h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    Desbloquea todo el potencial de LanaSync con nuestro plan Pro.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Free Plan */}
                <div className="bg-surface border border-gray-700 rounded-2xl p-8 flex flex-col relative overflow-hidden">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-300">Básico</h3>
                        <div className="text-3xl font-bold mt-2">$0 <span className="text-sm text-gray-500 font-normal">/mes</span></div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>1 Grupo Familiar</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Registro de Gastos Ilimitado</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Reportes Básicos</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-500">
                            <X className="w-5 h-5" />
                            <span>Asistente IA Avanzado</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-500">
                            <X className="w-5 h-5" />
                            <span>Múltiples Grupos</span>
                        </li>
                    </ul>

                    <button
                        className="w-full py-3 rounded-xl font-bold bg-gray-800 text-gray-400 cursor-not-allowed"
                        disabled
                    >
                        Plan Actual
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-surface border-2 border-primary/50 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-primary/10">
                    <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                        RECOMENDADO
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Crown className="w-5 h-5 text-primary" />
                            Pro
                        </h3>
                        <div className="text-3xl font-bold mt-2">$9.99 <span className="text-sm text-gray-500 font-normal">/mes</span></div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Todo lo del plan Básico</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Grupos Ilimitados</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Zap className="w-5 h-5 text-accent" />
                            <span>Asistente IA Financiero</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Check className="w-5 h-5 text-primary" />
                            <span>Soporte Prioritario</span>
                        </li>
                    </ul>

                    {isPro ? (
                        <button
                            className="w-full py-3 rounded-xl font-bold bg-green-500/20 text-green-500 cursor-default border border-green-500/50"
                        >
                            Activo
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold bg-primary hover:bg-primary/90 text-black transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            {loading ? 'Procesando...' : 'Suscribirse Ahora'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
