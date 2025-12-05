import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. Verify User
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        // 2. Verify Admin Email (Server-side check)
        // Ideally, this should be an env var in the Edge Function, but for this demo we'll check against a hardcoded value or pass it securely.
        // Better: Check if the user's email matches the one configured in the project secrets.
        const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');
        if (!ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
            return new Response(JSON.stringify({ error: 'Forbidden: Not an admin' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403,
            })
        }

        // 3. Initialize Admin Client (Service Role)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const url = new URL(req.url)
        const action = url.searchParams.get('action')

        if (action === 'stats') {
            // Fetch Stats
            const { count: totalUsers } = await supabaseAdmin.from('members').select('*', { count: 'exact', head: true });
            const { count: totalGroups } = await supabaseAdmin.from('groups').select('*', { count: 'exact', head: true });

            // Transactions Today
            const today = new Date().toISOString().split('T')[0];
            const { count: transactionsToday } = await supabaseAdmin
                .from('transactions')
                .select('*', { count: 'exact', head: true })
                .gte('date', today);

            return new Response(JSON.stringify({ totalUsers, totalGroups, transactionsToday }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        else if (action === 'users') {
            // List Users (from members table for now, or auth.users if we had access, but members is safer/easier here)
            const { data: users, error } = await supabaseAdmin
                .from('members')
                .select('user_id, name, role, subscription_status, created_at')
                .limit(50);

            if (error) throw error;

            return new Response(JSON.stringify({ users }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        else if (action === 'ban') {
            const { userId } = await req.json();
            if (!userId) throw new Error('Missing userId');

            // In a real app, we would use auth.admin.updateUserById(userId, { ban_duration: ... })
            // Here we will just update a metadata field or status in members table for demo purposes
            // Or actually, let's try to update the members table status if we have one, or just return success mock.

            // Let's assume we update subscription_status to 'BANNED'
            const { error } = await supabaseAdmin
                .from('members')
                .update({ subscription_status: 'BANNED' })
                .eq('user_id', userId);

            if (error) throw error;

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
