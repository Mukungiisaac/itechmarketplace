import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import HouseCard from "@/components/HouseCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
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
  const [services, setServices] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchServices();
    fetchHouses();
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

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    }
  };

  const fetchHouses = async () => {
    try {
      const { data, error } = await supabase
        .from("houses")
        .select("*");

      if (error) throw error;

      const formattedHouses = data?.map((house) => ({
        name: house.title,
        price: `KSh ${house.rent}`,
        location: house.location,
        type: house.house_type,
        hasWater: house.water === "yes",
        hasWifi: house.wifi === "yes",
        phone: house.contact_number || "",
        image: house.photo_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      })) || [];

      setHouses(formattedHouses);
    } catch (error) {
      console.error("Error fetching houses:", error);
      toast({
        title: "Error",
        description: "Failed to load houses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractPrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, ""));
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
  }).slice(0, 4);

  const filteredServices = services.filter((service) => {
    const price = extractPrice(service.price);
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesSearch;
  }).slice(0, 2);

  const filteredHouses = houses.filter((house) => {
    const price = extractPrice(house.price);
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesSearch;
  }).slice(0, 2);

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
                placeholder="Search products, services, houses..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Available Houses */}
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Available Houses</h2>
                <p className="text-muted-foreground mt-1">Browse our collection of quality homes</p>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading houses...</p>
                </div>
              ) : filteredHouses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No houses found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHouses.map((house, index) => (
                    <HouseCard key={index} {...house} />
                  ))}
                </div>
              )}
            </section>

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

            {/* Services */}
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Available Services</h2>
                <p className="text-muted-foreground mt-1">Find the services you need</p>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading services...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No services found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {service.photo_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={service.photo_url}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <Badge variant="secondary">{service.category}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            KES {service.price}
                          </span>
                          <Badge variant="outline">{service.availability}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{service.contact_number}</span>
                        </div>
                      </CardContent>
                    </Card>
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
