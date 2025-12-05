import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { question, context } = await req.json()
        console.log("Received question:", question);
        console.log("Received context:", JSON.stringify(context));

        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            throw new Error('GEMINI_API_KEY not set')
        }

        const prompt = `
      Eres un asesor financiero personal estricto pero amable.
      
      DATOS DEL USUARIO:
      - Saldo Efectivo: $${context.saldoEfectivo}
      - Saldo Vales: $${context.saldoVales}
      - Total Ingresos (Mes): $${context.totalIncome}
      - Total Gastos (Mes): $${context.totalExpenses}
      - Transacciones Recientes: ${JSON.stringify(context.recentTransactions)}

      PREGUNTA DEL USUARIO: "${question}"

      INSTRUCCIONES:
      1. Analiza si el usuario tiene capacidad financiera para lo que pregunta.
      2. Si pregunta si puede gastar X cantidad, verifica si tiene saldo suficiente (prioriza efectivo).
      3. Sé directo. Si no tiene dinero, dile que no y sugiérele una alternativa económica (ej: comer en casa).
      4. Si tiene dinero, dile que sí pero con un consejo de ahorro.
      5. Mantén la respuesta corta (máximo 3 oraciones).
    `

        console.log("Sending prompt to Gemini...");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            throw new Error(data.error?.message || 'Error calling Gemini API');
        }

        console.log("Gemini response received.");

        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar una respuesta."

        return new Response(JSON.stringify({ answer }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error("Edge Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
