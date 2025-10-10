import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  seller_id: string;
  profiles: {
    full_name: string;
    phone_number: string | null;
  };
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles (
            full_name,
            phone_number
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <FilterSidebar />
          </aside>

          <main className="space-y-12">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 h-12 text-base"
              />
            </div>

            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Marketplace Items</h2>
                <p className="text-muted-foreground mt-1">Discover great deals on products</p>
              </div>
              {loading ? (
                <p className="text-center">Loading products...</p>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id}
                      name={product.title}
                      price={`KES ${product.price}`}
                      description={product.description || ""}
                      seller={product.profiles?.full_name || "Unknown"}
                      phone={product.profiles?.phone_number || "N/A"}
                      image={product.photo_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No products available yet.</p>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;