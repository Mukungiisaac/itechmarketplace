import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon } from "lucide-react";

const OptimizeImages = () => {
  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const optimizeTable = async (table: string) => {
    setIsOptimizing(table);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-images', {
        body: { table, batchSize: 10 }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, [table]: data }));
      
      toast({
        title: "Optimization Complete",
        description: `Processed ${data.processed} images from ${table}`,
      });

      // If there are more to process, ask if they want to continue
      if (data.remaining > 0) {
        toast({
          title: "More Images Available",
          description: `${data.remaining} more images can be optimized. Click again to continue.`,
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
        {['products', 'services', 'houses'].map((table) => (
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
                  <p>✓ Processed: {results[table].processed}</p>
                  {results[table].errors && (
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
