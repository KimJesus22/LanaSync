use wasm_bindgen::prelude::*;
use rand::prelude::*;

#[wasm_bindgen]
pub fn calculate_compound_interest_simulation(
    initial_amount: f64,
    monthly_contribution: f64,
    annual_interest_rate: f64,
    years: i32,
) -> Vec<f64> {
    let mut rng = rand::thread_rng();
    let num_simulations = 1000;
    let mut results = Vec::with_capacity(num_simulations);

    for _ in 0..num_simulations {
        let mut current_balance = initial_amount;
        let monthly_rate = annual_interest_rate / 12.0 / 100.0;

        for _ in 0..(years * 12) {
            // Add some volatility (Monte Carlo aspect)
            // Random fluctuation between -0.5% and +0.5% monthly on top of base rate
            let volatility = (rng.gen::<f64>() - 0.5) / 100.0; 
            let adjusted_rate = monthly_rate + volatility;

            current_balance = current_balance * (1.0 + adjusted_rate) + monthly_contribution;
        }
        results.push(current_balance);
    }

    // Sort results to find percentiles later in JS if needed, or just return raw data
    results.sort_by(|a, b| a.partial_cmp(b).unwrap());
    results
}
