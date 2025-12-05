import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { supabase } from '../supabaseClient';

const AIAssistant = () => {
    const { transactions, saldoEfectivo, saldoVales } = useFinanzas();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hola, soy tu asesor financiero. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // Calculate Context
            const totalIncome = transactions
                .filter(t => t.type === 'ingreso')
                .reduce((acc, curr) => acc + curr.amount, 0);

            const totalExpenses = transactions
                .filter(t => t.type === 'gasto')
                .reduce((acc, curr) => acc + curr.amount, 0);

            const context = {
                saldoEfectivo,
                saldoVales,
                totalIncome,
                totalExpenses,
                recentTransactions: transactions.slice(0, 5) // Send last 5 transactions for context
            };

            const { data, error } = await supabase.functions.invoke('financial-advisor', {
                body: {
                    question: userMessage,
                    context
                }
            });

            if (error) throw error;

            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);

        } catch (error) {
            console.error("Error asking AI:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema al pensar. Intenta de nuevo.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 left-4 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 z-50 flex items-center gap-2"
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
                {!isOpen && <span className="hidden md:inline text-sm font-medium">Asesor IA</span>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 left-4 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {/* Header */}
                    <div className="bg-gray-800 p-4 rounded-t-2xl border-b border-gray-700 flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Asesor Financiero</h3>
                            <p className="text-xs text-gray-400">Powered by Gemini</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-700 flex gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Pregunta sobre tus finanzas..."
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
