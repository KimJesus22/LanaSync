import React, { useMemo } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { getDaysInMonth, getDate } from 'date-fns';

const FinancialProjection = () => {
    const { transactions, recurringExpenses, currentMonth } = useFinanzas();

    const projectionData = useMemo(() => {
        const today = new Date();
        const daysInMonth = getDaysInMonth(currentMonth);
        // If we are looking at a past month, use all days. If current month, use today's date.
        // But usually projection is useful for CURRENT month.
        // Let's assume current month context.
        const currentDay = getDate(today);

        // 1. Calculate Income
        const totalIncome = transactions
            .filter(t => t.type === 'ingreso')
            .reduce((acc, t) => acc + t.amount, 0);

        // 2. Calculate Fixed Expenses (Recurring)
        // We assume recurringExpenses contains ALL fixed expenses for the month
        const totalFixed = recurringExpenses.reduce((acc, e) => acc + e.amount, 0);

        // 3. Calculate Variable Expenses (Actual spent so far)
        // We filter out transactions that match recurring expenses to avoid double counting 
        // or skewing the daily average if a fixed expense is paid early.
        // A simple heuristic is: if description matches a recurring expense name.
        const variableTransactions = transactions.filter(t => {
            if (t.type !== 'gasto') return false;
            const isRecurring = recurringExpenses.some(re => re.name === t.description);
            return !isRecurring;
        });

        const totalVariableSpent = variableTransactions.reduce((acc, t) => acc + t.amount, 0);

        // 4. Calculate Daily Average (Variable)
        // Avoid division by zero
        const effectiveDay = Math.max(1, currentDay);
        const dailyAverage = totalVariableSpent / effectiveDay;

        // 5. Project Variable Expenses
        const projectedVariable = dailyAverage * daysInMonth;

        // 6. Total Projected Spend
        const totalProjectedSpend = totalFixed + projectedVariable;

        // 7. Analysis
        const disposableIncome = totalIncome - totalFixed;
        const projectedBalance = disposableIncome - projectedVariable;

        return {
            dailyAverage,
            projectedVariable,
            totalProjectedSpend,
            projectedBalance,
            isDanger: projectedBalance < 0,
            daysInMonth,
            currentDay
        };
    }, [transactions, recurringExpenses, currentMonth]);

    // Only show if there is some data to project
    if (transactions.length === 0 && recurringExpenses.length === 0) return null;

    const {
        dailyAverage,
        projectedVariable,
        projectedBalance,
        isDanger
    } = projectionData;

    // Wasm Integration
    const [wasmModule, setWasmModule] = React.useState(null);
    const [simulationResults, setSimulationResults] = React.useState(null);
    const [simulating, setSimulating] = React.useState(false);

    React.useEffect(() => {
        const loadWasm = async () => {
            try {
                // Dynamic import to avoid crashing if wasm is not built
                const wasm = await import('../../wasm-finance/pkg/wasm_finance');
                await wasm.default(); // Initialize if needed (depending on build target)
                setWasmModule(wasm);
            } catch (e) {
                console.warn("Wasm module not found or failed to load. Run 'wasm-pack build' to enable simulations.", e);
            }
        };
        loadWasm();
    }, []);

    const runSimulation = () => {
        if (!wasmModule) return;
        setSimulating(true);

        // Simulate: Initial Balance = projectedBalance (if positive) or 0
        // Monthly Contribution = disposableIncome (if positive) * 0.2 (save 20%)
        // Interest Rate = 7% (S&P 500 avg)
        // Years = 10

        const initial = Math.max(0, projectedBalance);
        const monthly = Math.max(0, (projectionData.projectedBalance + projectionData.projectedVariable) * 0.1); // Save 10% of income

        setTimeout(() => {
            try {
                const results = wasmModule.calculate_compound_interest_simulation(initial, monthly, 7.0, 10);
                // Results is a Float64Array
                // Calculate percentiles
                const p50 = results[Math.floor(results.length * 0.5)];
                const p90 = results[Math.floor(results.length * 0.9)];

                setSimulationResults({ p50, p90 });
            } catch (e) {
                console.error("Error running Wasm simulation:", e);
            } finally {
                setSimulating(false);
            }
        }, 100); // Small delay to show loading state
    };

    return (
        <>
            <div className={`p-6 rounded-2xl border-2 shadow-lg mb-6 animate-in fade-in slide-in-from-bottom-4 ${isDanger
                ? 'bg-red-900/20 border-red-500/50'
                : 'bg-green-900/20 border-green-500/50'
                }`}>
                <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDanger ? 'text-red-400' : 'text-green-400'
                    }`}>
                    {isDanger ? '⚠️ Alerta Financiera' : '✅ Proyección Positiva'}
                </h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Gasto Promedio Diario (Variable)</p>
                        <p className="text-2xl font-bold text-white">
                            ${dailyAverage.toFixed(2)}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm">
                        {isDanger ? (
                            <>
                                <p className="text-red-300 font-medium text-lg mb-1">
                                    ⚠️ A este ritmo, te faltarán:
                                </p>
                                <p className="text-3xl font-black text-red-500">
                                    ${Math.abs(projectedBalance).toFixed(2)}
                                </p>
                                <p className="text-xs text-red-400/80 mt-2">
                                    Proyección de gasto variable: ${projectedVariable.toFixed(2)}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-green-300 font-medium text-lg mb-1">
                                    ✅ Vas bien, te sobrarán aprox:
                                </p>
                                <p className="text-3xl font-black text-green-500">
                                    ${projectedBalance.toFixed(2)}
                                </p>
                                <p className="text-xs text-green-400/80 mt-2">
                                    Manteniendo tu promedio de ${dailyAverage.toFixed(0)}/día
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Wasm Simulation Section */}
            <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-900/10 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                        🚀 Simulación Monte Carlo (Rust + Wasm)
                    </h3>
                    {wasmModule ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                            Wasm Cargado
                        </span>
                    ) : (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/30">
                            Wasm no detectado
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-400 mb-4">
                    Proyecta tu riqueza a 10 años usando 1,000 simulaciones de mercado ejecutadas en WebAssembly.
                </p>

                {simulationResults ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">Escenario Normal (P50)</p>
                            <p className="text-xl font-bold text-white">${simulationResults.p50.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">Escenario Optimista (P90)</p>
                            <p className="text-xl font-bold text-green-400">${simulationResults.p90.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                ) : null}

                <button
                    onClick={runSimulation}
                    disabled={!wasmModule || simulating}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {simulating ? 'Simulando...' : 'Correr Simulación'}
                </button>

                {!wasmModule && (
                    <p className="text-xs text-center mt-2 text-gray-500">
                        Requiere compilar Rust: <code>wasm-pack build --target web</code>
                    </p>
                )}
            </div>
        </>
    );
};

export default FinancialProjection;
