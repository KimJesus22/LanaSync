import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-gray-700/50 p-2 rounded-lg">
                    <Cookie className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-gray-200">
                        Usamos cookies para que no pierdas tu sesión.
                    </p>
                </div>
                <button
                    onClick={acceptCookies}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
