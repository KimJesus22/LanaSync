import React from 'react';
import { Shield, Lock, CreditCard, Bell, AlertTriangle, FileText } from 'lucide-react';

const Legal = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
                        Centro Legal
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Transparencia y confianza son nuestros pilares.
                    </p>
                </div>

                {/* Política de Privacidad */}
                <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-white">Política de Privacidad</h2>
                    </div>

                    <div className="space-y-6 text-gray-300">
                        <p>
                            En LanaSync, nos tomamos muy en serio la seguridad de tus datos. A continuación, detallamos las tecnologías y servicios de terceros que utilizamos para garantizar el funcionamiento de nuestra plataforma:
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-blue-400">
                                    <Lock className="w-5 h-5" />
                                    <span className="font-semibold">Supabase</span>
                                </div>
                                <p className="text-sm">
                                    Utilizamos Supabase para el almacenamiento seguro de tus datos y la gestión de la autenticación. Tus datos están encriptados y protegidos.
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-purple-400">
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-semibold">Stripe</span>
                                </div>
                                <p className="text-sm">
                                    El procesamiento de pagos se realiza a través de Stripe. LanaSync no almacena ni tiene acceso a los datos completos de tu tarjeta de crédito.
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-teal-400">
                                    <FileText className="w-5 h-5" />
                                    <span className="font-semibold">OpenAI / Gemini</span>
                                </div>
                                <p className="text-sm">
                                    Utilizamos modelos de Inteligencia Artificial (OpenAI y Google Gemini) para procesar información y ofrecerte análisis financieros personalizados.
                                </p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 mb-2 text-orange-400">
                                    <Bell className="w-5 h-5" />
                                    <span className="font-semibold">OneSignal</span>
                                </div>
                                <p className="text-sm">
                                    Usamos OneSignal para enviarte notificaciones importantes sobre tu cuenta y actividad financiera, asegurando que no te pierdas nada.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Términos de Servicio */}
                <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-2xl font-bold text-white">Términos de Servicio</h2>
                    </div>

                    <div className="space-y-4 text-gray-300">
                        <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Descargo de Responsabilidad Financiera</h3>
                            <p>
                                <strong>LanaSync no es un asesor financiero certificado.</strong> La información, análisis y sugerencias proporcionadas por nuestra plataforma y sus herramientas de IA son solo para fines informativos y educativos.
                            </p>
                        </div>

                        <p>
                            No nos hacemos responsables por decisiones económicas, inversiones o pérdidas financieras que puedan derivarse del uso de nuestra aplicación. Te recomendamos consultar con un profesional financiero calificado antes de tomar decisiones económicas importantes.
                        </p>

                        <p>
                            Al utilizar LanaSync, aceptas que eres el único responsable de tus decisiones financieras y liberas a LanaSync de cualquier responsabilidad relacionada con tus acciones económicas.
                        </p>
                    </div>
                </section>

                <footer className="text-center text-gray-500 text-sm pt-8">
                    &copy; {new Date().getFullYear()} LanaSync. Todos los derechos reservados.
                </footer>
            </div>
        </div>
    );
};

export default Legal;
