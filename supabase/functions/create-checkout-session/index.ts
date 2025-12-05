import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { price_id, user_id, return_url } = await req.json()

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price_id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${return_url}?success=true`,
            cancel_url: `${return_url}?canceled=true`,
            customer_email: undefined, // We could pass email if we had it easily, or let Stripe ask
            client_reference_id: user_id,
            metadata: {
                user_id: user_id
            }
        })

        return new Response(
            JSON.stringify({ url: session.url }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
