import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { isSameMonth, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const exportToCSV = (transactions, currentMonth, users) => {
    // Filter by month
    const monthlyTransactions = transactions.filter(t =>
        isSameMonth(parseISO(t.date), currentMonth)
    );

    if (monthlyTransactions.length === 0) {
        alert("No hay transacciones para exportar en este mes.");
        return;
    }

    // Headers
    const headers = ["Fecha", "Concepto", "Monto", "Quién", "Método", "Categoría"];

    // Rows
    const rows = monthlyTransactions.map(t => {
        const user = users.find(u => u.id === t.userId)?.name || 'Desconocido';
        // Escape quotes in description
        const description = (t.description || '').replace(/"/g, '""');

        return [
            format(parseISO(t.date), 'yyyy-MM-dd'),
            `"${description}"`,
            t.amount,
            user,
            t.paymentMethod,
            t.category
        ].join(",");
    });

    // Combine
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create link and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const fileName = `reporte_${format(currentMonth, 'MMMM_yyyy', { locale: es })}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
