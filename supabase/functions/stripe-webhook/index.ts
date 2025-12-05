import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

serve(async (req) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    try {
        const body = await req.text()
        let event

        try {
            event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
        } catch (err) {
            console.error(`Webhook signature verification failed.`, err.message)
            return new Response(`Webhook Error: ${err.message}`, { status: 400 })
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object
                const userId = session.client_reference_id
                const customerId = session.customer

                if (userId) {
                    // Update user subscription status
                    const { error } = await supabase
                        .from('members')
                        .update({
                            subscription_status: 'PREMIUM',
                            stripe_customer_id: customerId
                        })
                        .eq('user_id', userId) // Assuming user_id column exists and links to auth.users

                    if (error) {
                        console.error('Error updating user subscription:', error)
                        return new Response('Error updating user', { status: 500 })
                    }
                    console.log(`User ${userId} upgraded to PREMIUM`)
                }
                break

            case 'customer.subscription.deleted':
                const subscription = event.data.object
                const customer = subscription.customer

                // Find user by stripe_customer_id and downgrade
                const { error: downgradeError } = await supabase
                    .from('members')
                    .update({ subscription_status: 'FREE' })
                    .eq('stripe_customer_id', customer)

                if (downgradeError) {
                    console.error('Error downgrading user:', downgradeError)
                }
                console.log(`Customer ${customer} subscription deleted`)
                break

            default:
                console.log(`Unhandled event type ${event.type}`)
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
