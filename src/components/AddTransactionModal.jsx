import { useState } from 'react';
import { Plus, X, Wallet, CreditCard } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';

const AddTransactionModal = () => {
    const { addTransaction, users } = useFinanzas();
    const [isOpen, setIsOpen] = useState(false);

    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('efectivo'); // 'efectivo' | 'vales'
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Comida');
    const [userId, setUserId] = useState(users[0]?.id || 'user-1'); // Default to first user

    const categories = ['Comida', 'Transporte', 'Ocio', 'Moto', 'Universidad', 'Celular', 'Otros'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        const transaction = {
            amount: parseFloat(amount),
            type: 'gasto', // Default to expense for now as per requirements imply spending
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
                            <h2 className="text-xl font-bold text-white">Nuevo Gasto</h2>
                            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Amount */}
                            <div>
                                <label className="block text-xs text-muted mb-1">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-muted">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-gray-700 focus:border-primary text-4xl font-bold text-white pl-6 py-2 outline-none"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
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
                                        placeholder="¿En qué gastaste?"
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
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Guardar Gasto
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTransactionModal;
