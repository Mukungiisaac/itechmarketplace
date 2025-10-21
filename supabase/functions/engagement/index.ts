import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type TableName = 'products' | 'houses' | 'services'

type Action = 'view' | 'like' | 'unlike'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { table, id, action } = await req.json() as { table: TableName; id: string; action: Action }

    if (!table || !id || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing table, id or action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const allowedTables: TableName[] = ['products', 'houses', 'services']
    if (!allowedTables.includes(table)) {
      return new Response(
        JSON.stringify({ error: 'Invalid table' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['view', 'like', 'unlike'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Fetch current counts
    const { data: row, error: fetchError } = await supabaseAdmin
      .from(table)
      .select('views, likes')
      .eq('id', id)
      .single()

    if (fetchError || !row) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let updates: Record<string, number> = {}
    if (action === 'view') {
      updates.views = (row.views || 0) + 1
    } else if (action === 'like') {
      updates.likes = (row.likes || 0) + 1
    } else if (action === 'unlike') {
      const next = (row.likes || 0) - 1
      updates.likes = next < 0 ? 0 : next
    }

    const { error: updateError } = await supabaseAdmin
      .from(table)
      .update(updates)
      .eq('id', id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, ...updates }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Engagement function error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})