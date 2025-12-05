import React from 'react';
import * as Sentry from "@sentry/react";
import { AlertTriangle, RefreshCw } from 'lucide-react';

const GlobalErrorBoundary = ({ children }) => {
    return (
        <Sentry.ErrorBoundary
            fallback={({ error, resetError }) => (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                        <div className="bg-red-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Ups, algo salió mal</h1>
                        <p className="text-gray-400 mb-6">
                            Lo sentimos, la aplicación ha encontrado un error inesperado. Nuestro equipo ya ha sido notificado.
                        </p>

                        <div className="bg-black/30 p-4 rounded-lg mb-6 text-left overflow-auto max-h-32">
                            <code className="text-xs text-red-300 font-mono">
                                {error.toString()}
                            </code>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} />
                            Recargar página
                        </button>
                    </div>
                </div>
            )}
        >
            {children}
        </Sentry.ErrorBoundary>
    );
};

export default GlobalErrorBoundary;
