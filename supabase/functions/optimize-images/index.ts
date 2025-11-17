import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { table, batchSize = 5 } = await req.json();

    if (!['products', 'services', 'houses'].includes(table)) {
      throw new Error('Invalid table name');
    }

    console.log(`Fetching images from ${table}...`);

    // Fetch images that are NOT already WebP
    const { data: items, error: fetchError } = await supabase
      .from(table)
      .select('id, photo_url')
      .not('photo_url', 'is', null)
      .not('photo_url', 'like', 'data:image/webp%')
      .limit(batchSize);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'All images are already optimized!', 
          processed: 0,
          remaining: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${items.length} images to optimize`);

    const sizeConfig: Record<string, { maxDimension: number, quality: number }> = {
      products: { maxDimension: 800, quality: 0.85 },
      services: { maxDimension: 800, quality: 0.85 },
      houses: { maxDimension: 1200, quality: 0.85 },
    };

    const config = sizeConfig[table];
    let processed = 0;
    const errors: string[] = [];

    for (const item of items) {
      try {
        if (!item.photo_url || !item.photo_url.startsWith('data:image/')) {
          continue;
        }

        const originalSize = item.photo_url.length;
        console.log(`Processing ${item.id}, original size: ${(originalSize / 1024).toFixed(1)}KB`);

        // Parse base64 data
        const matches = item.photo_url.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          throw new Error('Invalid base64 format');
        }

        const base64Data = matches[2];
        
        // Decode base64 to binary
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create blob and decode image
        const blob = new Blob([bytes]);
        const imageBitmap = await createImageBitmap(blob);

        // Calculate new dimensions
        let { width, height } = imageBitmap;
        const maxDim = config.maxDimension;
        
        if (width > maxDim || height > maxDim) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxDim;
            height = maxDim / aspectRatio;
          } else {
            height = maxDim;
            width = maxDim * aspectRatio;
          }
        }

        width = Math.round(width);
        height = Math.round(height);

        console.log(`Resizing ${imageBitmap.width}x${imageBitmap.height} → ${width}x${height}`);

        // Create canvas (Deno runtime provides this)
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('No canvas context');
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        // Convert to WebP
        const webpBlob = await canvas.convertToBlob({ 
          type: 'image/webp', 
          quality: config.quality 
        });

        // Convert to base64
        const arrayBuffer = await webpBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const binaryStr = String.fromCharCode(...uint8Array);
        const webpBase64 = btoa(binaryStr);
        const optimizedUrl = `data:image/webp;base64,${webpBase64}`;

        const newSize = optimizedUrl.length;
        const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
        console.log(`Optimized to ${(newSize / 1024).toFixed(1)}KB (${reduction}% smaller)`);

        // Update database
        const { error: updateError } = await supabase
          .from(table)
          .update({ photo_url: optimizedUrl })
          .eq('id', item.id);

        if (updateError) throw updateError;

        processed++;
        
      } catch (err: any) {
        const errorMsg = `Error on ${item.id}: ${err?.message || err}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Optimized ${processed}/${items.length} images`,
        processed,
        errors: errors.length > 0 ? errors : undefined,
        table
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
