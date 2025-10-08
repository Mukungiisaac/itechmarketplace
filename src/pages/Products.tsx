import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";

const Products = () => {
  const products = [
    {
      name: "Cooker",
      price: "KES 23000.0",
      description: "Get a modern cooker at a comrade price",
      seller: "Neptune",
      phone: "+254115810222",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    },
    {
      name: "Wardrobe",
      price: "KES 3000.0",
      description: "Good refurbished wardrobe",
      seller: "ICT Next to CZ",
      phone: "0781675645",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
    },
  ];

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
