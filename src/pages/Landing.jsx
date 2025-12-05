import React from 'react';
import { Link } from 'react-router-dom';
import { WifiOff, Scan, Users, Check, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
                            L
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            LanaSync
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/login"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Empezar Gratis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-sm text-emerald-400 mb-8 animate-fade-in">
                        <Star className="w-4 h-4 fill-current" />
                        <span>La App #1 de Finanzas Personales</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
                        Domina tus Finanzas <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                            con Inteligencia Artificial
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Toma el control total de tu dinero. Escanea tickets, predice gastos y comparte metas con tu familia, todo potenciado por IA.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            Empezar Gratis <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/legal"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold text-lg transition-all border border-gray-700"
                        >
                            Saber más
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300`}>
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-400 text-sm">
                            Usado y amado por <span className="text-white font-semibold">más de 3 familias</span> (incluyendo la mía)
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                <WifiOff className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Modo Offline</h3>
                            <p className="text-gray-400">
                                ¿Sin internet? No hay problema. Registra tus gastos en cualquier lugar y sincroniza cuando vuelvas a estar conectado.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Scan className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Escáner de Tickets</h3>
                            <p className="text-gray-400">
                                Olvídate de escribir. Toma una foto a tu ticket y nuestra IA extraerá los detalles automáticamente.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Metas Compartidas</h3>
                            <p className="text-gray-400">
                                Gestiona las finanzas del hogar en equipo. Crea presupuestos y metas de ahorro colaborativas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Planes Simples</h2>
                        <p className="text-gray-400">Empieza gratis y mejora cuando lo necesites.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">Básico</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$0</span>
                                    <span className="text-gray-500">/mes</span>
                                </div>
                                <p className="text-gray-400 mt-4">Perfecto para empezar a organizar tus gastos.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-emerald-400" /> 50 Gastos mensuales
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-emerald-400" /> 1 Presupuesto
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check className="w-5 h-5 text-emerald-400" /> Modo Offline
                                </li>
                            </ul>
                            <Link
                                to="/login"
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors text-center"
                            >
                                Comenzar Gratis
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-emerald-500/30 relative flex flex-col">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                RECOMENDADO
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-emerald-400 mb-2">Pro</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$9</span>
                                    <span className="text-gray-500">/mes</span>
                                </div>
                                <p className="text-gray-400 mt-4">Para quienes quieren control total y automatización.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400" /> Gastos ilimitados
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400" /> Presupuestos ilimitados
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400" /> Escáner de Tickets con IA
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400" /> Metas Compartidas
                                </li>
                            </ul>
                            <Link
                                to="/login"
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors text-center shadow-lg shadow-emerald-500/20"
                            >
                                Obtener Pro
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">L</div>
                        <span className="font-semibold text-gray-300">LanaSync</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link to="/legal" className="hover:text-white transition-colors">Privacidad</Link>
                        <Link to="/legal" className="hover:text-white transition-colors">Términos</Link>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} LanaSync.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
