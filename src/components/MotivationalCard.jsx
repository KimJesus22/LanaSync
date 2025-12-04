import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent } from './ui/Card';

const quotes = [
    'Gasta siempre una moneda menos de lo que ganes.',
    'No ahorres lo que te sobra, gasta lo que te sobra después de ahorrar.',
    'Cuida los pequeños gastos; un pequeño agujero hunde un barco.',
    'Comprar por impulso es pagar por ansiedad. ¡Resiste!',
    'El hombre que no planifica su futuro encontrará problemas en su presente.'
];

const MotivationalCard = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Select a random quote on mount
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return (
        <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-none shadow-lg">
            <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-full text-white shrink-0">
                    <Quote size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white mb-2">Sabiduría Financiera</h3>
                    <p className="text-gray-200 italic">"{quote}"</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default MotivationalCard;
