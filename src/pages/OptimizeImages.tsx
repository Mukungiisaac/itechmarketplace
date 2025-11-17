import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { optimizeImage, blobToBase64, getImageSizeCategory } from "@/utils/imageOptimization";

const OptimizeImages = () => {
  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const optimizeTable = async (table: 'products' | 'services' | 'houses') => {
    setIsOptimizing(table);
    try {
      // Fetch images that are NOT already WebP
      const { data: items, error: fetchError } = await supabase
        .from(table)
        .select('id, photo_url')
        .not('photo_url', 'is', null)
        .not('photo_url', 'like', 'data:image/webp%')
        .limit(10);

      if (fetchError) throw fetchError;

      if (!items || items.length === 0) {
        toast({
          title: "All Done!",
          description: `All images in ${table} are already optimized`,
        });
        setResults(prev => ({ ...prev, [table]: { processed: 0, total: 0 } }));
        return;
      }

      let processed = 0;
      const errors: string[] = [];

      for (const item of items) {
        try {
          if (!item.photo_url || !item.photo_url.startsWith('data:image/')) {
            continue;
          }

          // Convert base64 to blob
          const base64Data = item.photo_url.split(',')[1];
          const mimeType = item.photo_url.match(/data:([^;]+);/)?.[1] || 'image/png';
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: mimeType });
          const file = new File([blob], 'image', { type: mimeType });

          // Optimize using our utility
          const imageType = table === 'houses' ? 'house' : table === 'products' ? 'product' : 'service';
          const optimizedBlob = await optimizeImage(file, getImageSizeCategory(imageType));
          const optimizedBase64 = await blobToBase64(optimizedBlob);

          // Update database
          const { error: updateError } = await supabase
            .from(table)
            .update({ photo_url: optimizedBase64 })
            .eq('id', item.id);

          if (updateError) throw updateError;
          processed++;
        } catch (err: any) {
          errors.push(`Error on ${item.id}: ${err?.message || err}`);
        }
      }

      setResults(prev => ({ ...prev, [table]: { processed, total: items.length, errors } }));
      
      toast({
        title: "Optimization Complete",
        description: `Processed ${processed}/${items.length} images from ${table}`,
      });

      if (processed < items.length) {
        toast({
          title: "Some Images Failed",
          description: `${items.length - processed} images could not be optimized`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Optimization Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image Optimization</h1>
        <p className="text-muted-foreground">
          Convert existing images to WebP format and optimize their size
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(['products', 'services', 'houses'] as const).map((table) => (
          <Card key={table}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <ImageIcon className="h-5 w-5" />
                {table}
              </CardTitle>
              <CardDescription>
                Optimize {table} images to WebP format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => optimizeTable(table)}
                disabled={isOptimizing !== null}
                className="w-full"
              >
                {isOptimizing === table ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  'Optimize Images'
                )}
              </Button>
              {results[table] && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>✓ Processed: {results[table].processed}/{results[table].total}</p>
                  {results[table].errors && results[table].errors.length > 0 && (
                    <p className="text-destructive">⚠ Errors: {results[table].errors.length}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Converts existing images to WebP format (much smaller file size)</p>
          <p>• Resizes images to optimal dimensions (800x800 for products/services, 1200x900 for houses)</p>
          <p>• Compresses with 85% quality (nearly identical visual quality)</p>
          <p>• Processes 10 images at a time to avoid timeouts</p>
          <p>• Updates the database with optimized versions</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizeImages;
