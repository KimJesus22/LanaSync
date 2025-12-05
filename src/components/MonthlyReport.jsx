import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F59E0B' // Amber-500
    },
    title: {
        fontSize: 18,
        color: '#111827'
    },
    subtitle: {
        fontSize: 10,
        color: '#6B7280'
    },
    section: {
        margin: 10,
        padding: 10,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#F3F4F6',
        padding: 15,
        borderRadius: 5
    },
    summaryItem: {
        alignItems: 'center'
    },
    summaryLabel: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 4
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827'
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#E5E7EB'
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        padding: 5
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        padding: 5
    },
    tableCellHeader: {
        margin: "auto",
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151'
    },
    tableCell: {
        margin: "auto",
        fontSize: 9,
        color: '#4B5563'
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10
    },
    quote: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#6B7280',
        marginBottom: 5
    },
    pageNumber: {
        fontSize: 8,
        color: '#9CA3AF'
    }
});

const MOTIVATIONAL_QUOTES = [
    "El ahorro no es solo guardar dinero, es guardar libertad.",
    "Cuida de los pequeños gastos; un pequeño agujero hunde un barco.",
    "No ahorres lo que te queda después de gastar, gasta lo que te queda después de ahorrar.",
    "La riqueza consiste mucho más en el disfrute que en la posesión.",
    "Un presupuesto te dice a dónde va tu dinero en lugar de preguntarte a dónde fue."
];

const MonthlyReport = ({ transactions, currentMonth, income, expenses, quote }) => {
    const monthName = format(currentMonth, 'MMMM yyyy', { locale: es });
    const balance = income - expenses;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logo}>LanaSync</Text>
                        <Text style={styles.subtitle}>Reporte Financiero Mensual</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.title}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</Text>
                        <Text style={styles.subtitle}>Generado el {format(new Date(), 'dd/MM/yyyy')}</Text>
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Ingresos Totales</Text>
                        <Text style={{ ...styles.summaryValue, color: '#10B981' }}>+${income.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Gastos Totales</Text>
                        <Text style={{ ...styles.summaryValue, color: '#EF4444' }}>-${expenses.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Balance Neto</Text>
                        <Text style={{ ...styles.summaryValue, color: balance >= 0 ? '#10B981' : '#EF4444' }}>
                            {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Transactions Table */}
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#374151' }}>Detalle de Movimientos</Text>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Fecha</Text></View>
                        <View style={{ ...styles.tableColHeader, width: '35%' }}><Text style={styles.tableCellHeader}>Descripción</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Categoría</Text></View>
                        <View style={{ ...styles.tableColHeader, width: '15%' }}><Text style={styles.tableCellHeader}>Monto</Text></View>
                    </View>
                    {/* Table Rows */}
                    {transactions.map((t, i) => (
                        <View style={styles.tableRow} key={i}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{format(new Date(t.date), 'dd/MM/yyyy')}</Text></View>
                            <View style={{ ...styles.tableCol, width: '35%' }}><Text style={styles.tableCell}>{t.description}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{t.category}</Text></View>
                            <View style={{ ...styles.tableCol, width: '15%' }}>
                                <Text style={{ ...styles.tableCell, color: t.type === 'ingreso' ? '#10B981' : '#EF4444' }}>
                                    {t.type === 'ingreso' ? '+' : '-'}${t.amount}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.quote}>"{quote}"</Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </View>
            </Page>
        </Document>
    );
};

export default MonthlyReport;
