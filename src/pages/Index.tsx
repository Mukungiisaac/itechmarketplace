import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });
  const [products, setProducts] = useState<any[]>([]);
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
          profiles:seller_id (
            full_name,
            phone_number
          )
        `);

      if (error) throw error;

      const formattedProducts = data?.map((product) => ({
        name: product.title,
        price: `KES ${product.price}`,
        description: product.description || "",
        seller: product.profiles?.full_name || "Unknown Seller",
        phone: product.profiles?.phone_number || "",
        image: product.photo_url || "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  };

  const filteredProducts = products.filter((product) => {
    const price = extractPrice(product.price);
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar onFilterChange={setFilters} />
          </aside>

          {/* Main Content */}
          <main className="space-y-12">
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Marketplace Items */}
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Marketplace Items</h2>
                <p className="text-muted-foreground mt-1">Discover great deals on products</p>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={index} {...product} />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
