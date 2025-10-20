import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: string;
  photo_url: string | null;
  seller_id: string;
  views: number;
  profiles: {
    full_name: string;
    phone_number: string | null;
  };
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
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

      let results: any[] = data || [];
      const needsProfileFetch = results.some((p: any) => !p.profiles);

      if (needsProfileFetch && results.length) {
        const sellerIds = Array.from(new Set(results.map((p: any) => p.seller_id)));
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, phone_number")
          .in("id", sellerIds);

        if (profilesData) {
          const map = Object.fromEntries(
            profilesData.map((pr: any) => [pr.id, { full_name: pr.full_name, phone_number: pr.phone_number }])
          );
          results = results.map((p: any) => ({
            ...p,
            profiles: p.profiles || map[p.seller_id] || null,
          }));
        }
      }

      return results as Product[];
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const extractPrice = (priceStr: string) => {
    const match = priceStr.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const filteredProducts = products.filter((product) => {
    const price = extractPrice(product.price);
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <FilterSidebar onFilterChange={setFilters} />
          </aside>

          <main className="space-y-12">
            <div className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Mobile filter button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden h-12 w-12">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar onFilterChange={(newFilters) => {
                      setFilters(newFilters);
                      setIsFilterOpen(false);
                    }} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Marketplace Items</h2>
                <p className="text-muted-foreground mt-1">Discover great deals on products</p>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-2/3 mt-1" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.title}
                      price={`KES ${product.price}`}
                      description={product.description || ""}
                      seller={product.profiles?.full_name || "Unknown"}
                      phone={product.profiles?.phone_number || "N/A"}
                      image={product.photo_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                      views={product.views || 0}
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
      <Footer />
    </div>
  );
};

export default Products;