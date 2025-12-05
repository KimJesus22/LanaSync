import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Save } from 'lucide-react';

const PricingConfig = () => {
    const [plans, setPlans] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data, error } = await supabase
                .from('app_config')
                .select('value')
                .eq('key', 'pricing_plans')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore not found

            if (data) {
                setPlans(data.value);
            } else {
                // Default structure if not found
                setPlans({
                    basic: { price: 0, features: ["50 Gastos/mes", "1 Presupuesto"] },
                    pro: { price: 9, features: ["Ilimitado", "IA"] }
                });
            }
        } catch (error) {
            console.error('Error fetching pricing config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('app_config')
                .upsert({
                    key: 'pricing_plans',
                    value: plans
                }, { onConflict: 'key' });

            if (error) throw error;
            alert('Configuración guardada correctamente');
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const updatePlan = (planKey, field, value) => {
        setPlans(prev => ({
            ...prev,
            [planKey]: {
                ...prev[planKey],
                [field]: value
            }
        }));
    };

    const updateFeature = (planKey, index, value) => {
        const newFeatures = [...plans[planKey].features];
        newFeatures[index] = value;
        updatePlan(planKey, 'features', newFeatures);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Configuración de Precios</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(plans || {}).map(([key, plan]) => (
                    <div key={key} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4 capitalize">{key} Plan</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Precio Mensual ($)</label>
                                <input
                                    type="number"
                                    value={plan.price}
                                    onChange={(e) => updatePlan(key, 'price', parseInt(e.target.value))}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Características</label>
                                <div className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(key, idx, e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingConfig;
