import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { image } = await req.json()
        if (!image) throw new Error('No image provided')

        // Clean base64 string if needed (remove data:image/jpeg;base64, prefix)
        const base64Image = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')

        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set')

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Analiza esta imagen de un recibo de compra. Extrae el TOTAL (número), la FECHA (formato ISO YYYY-MM-DD) y sugiere una CATEGORÍA (Comida, Transporte, Ocio, Moto, Universidad, Celular, Otros). Devuelve SOLO un JSON puro con las claves: total, date, category. No uses markdown." },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        })

        const data = await response.json()

        if (data.error) {
            throw new Error(data.error.message)
        }

        const textResponse = data.candidates[0].content.parts[0].text
        // Clean markdown if Gemini adds it
        const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim()
        const result = JSON.parse(jsonString)

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
