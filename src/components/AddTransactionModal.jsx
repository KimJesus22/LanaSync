import { useState, useEffect } from 'react';
import { Plus, X, Wallet, CreditCard, Mic } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';

const AddTransactionModal = () => {
    const { addTransaction, users } = useFinanzas();
    const [isOpen, setIsOpen] = useState(false);

    const [type, setType] = useState('gasto'); // 'gasto' | 'ingreso'
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('efectivo'); // 'efectivo' | 'vales'
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Comida');
    const [userId, setUserId] = useState(users[0]?.id || 'user-1'); // Default to first user
    const [isListening, setIsListening] = useState(false);

    const expenseCategories = ['Comida', 'Transporte', 'Ocio', 'Moto', 'Universidad', 'Celular', 'Otros'];
    const incomeCategories = ['Salario', 'Regalo', 'Venta', 'Otros'];

    const categories = type === 'gasto' ? expenseCategories : incomeCategories;

    // Keyword mapping for NLP
    const categoryKeywords = {
        'comida': 'Comida', 'almuerzo': 'Comida', 'cena': 'Comida', 'desayuno': 'Comida', 'tacos': 'Comida', 'super': 'Comida',
        'transporte': 'Transporte', 'uber': 'Transporte', 'gasolina': 'Transporte', 'bus': 'Transporte', 'camión': 'Transporte',
        'ocio': 'Ocio', 'cine': 'Ocio', 'salida': 'Ocio', 'fiesta': 'Ocio', 'juego': 'Ocio',
        'moto': 'Moto', 'taller': 'Moto', 'refacción': 'Moto',
        'universidad': 'Universidad', 'escuela': 'Universidad', 'libro': 'Universidad',
        'celular': 'Celular', 'recarga': 'Celular', 'plan': 'Celular',
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'es-MX';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Voz detectada:", transcript);
            parseVoiceCommand(transcript);
        };

        recognition.start();
    };

    const parseVoiceCommand = (text) => {
        const lowerText = text.toLowerCase();

        // 1. Detect Amount (numbers)
        // Matches "50", "50.50", "de 50"
        const amountMatch = lowerText.match(/(\d+(\.\d+)?)/);
        if (amountMatch) {
            setAmount(amountMatch[0]);
        }

        // 2. Detect Category
        let detectedCategory = 'Otros';
        for (const [keyword, cat] of Object.entries(categoryKeywords)) {
            if (lowerText.includes(keyword)) {
                detectedCategory = cat;
                break;
            }
        }
        setCategory(detectedCategory);

        // 3. Description is the full text (capitalized)
        const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
        setDescription(capitalized);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        const transaction = {
            amount: parseFloat(amount),
            type,
            category,
            paymentMethod,
            userId,
            description,
            date: new Date().toISOString()
        };

        await addTransaction(transaction);

        // Reset and close
        setAmount('');
        setDescription('');
        setIsOpen(false);
        setType('gasto');
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-primary hover:bg-green-600 text-black p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
            >
                <Plus size={32} />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                    {/* Modal Content */}
                    <div className="bg-surface w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {type === 'gasto' ? 'Nuevo Gasto' : 'Nuevo Ingreso'}
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Type Toggle */}
                        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
                            <button
                                onClick={() => setType('gasto')}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === 'gasto' ? 'bg-red-500/20 text-red-400' : 'text-muted hover:text-white'}`}
                            >
                                Gasto
                            </button>
                            <button
                                onClick={() => setType('ingreso')}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === 'ingreso' ? 'bg-green-500/20 text-green-400' : 'text-muted hover:text-white'}`}
                            >
                                Ingreso
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Amount & Mic */}
                            <div>
                                <label className="block text-xs text-muted mb-1">Monto</label>
                                <div className="relative flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className={`absolute left-0 top-1/2 -translate-y-1/2 text-2xl ${type === 'gasto' ? 'text-red-400' : 'text-green-400'}`}>$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className={`w-full bg-transparent border-b-2 border-gray-700 focus:border-primary text-4xl font-bold text-white pl-6 py-2 outline-none ${type === 'gasto' ? 'focus:border-red-500' : 'focus:border-green-500'}`}
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={startListening}
                                        className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-800 text-primary hover:bg-gray-700'}`}
                                        title="Hablar para registrar"
                                    >
                                        <Mic size={24} />
                                    </button>
                                </div>
                                {isListening && <p className="text-xs text-primary mt-1 animate-pulse">Escuchando... Di algo como "Gasto de 50 en comida"</p>}
                            </div>

                            {/* Payment Method */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('efectivo')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'efectivo'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-700 text-muted hover:border-gray-600'
                                        }`}
                                >
                                    <Wallet size={24} />
                                    <span className="font-medium">Efectivo</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('vales')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'vales'
                                        ? 'border-accent bg-accent/10 text-accent'
                                        : 'border-gray-700 text-muted hover:border-gray-600'
                                        }`}
                                >
                                    <CreditCard size={24} />
                                    <span className="font-medium">Vales</span>
                                </button>
                            </div>

                            {/* Concept & Category */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-muted mb-1">Concepto</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-gray-800 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder={type === 'gasto' ? "¿En qué gastaste?" : "¿De qué es el ingreso?"}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Categoría</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-gray-800 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Responsable</label>
                                        <select
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="w-full bg-gray-800 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                                        >
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className={`w-full text-black font-bold py-4 rounded-xl transition-colors ${type === 'gasto' ? 'bg-white hover:bg-gray-200' : 'bg-green-500 hover:bg-green-400'}`}
                            >
                                {type === 'gasto' ? 'Guardar Gasto' : 'Guardar Ingreso'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTransactionModal;
