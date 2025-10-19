import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import HouseCard from "@/components/HouseCard";
import ServiceCard from "@/components/ServiceCard";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: async () => {
      const { data: promotedUsers, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("promoted", true);

      if (rolesError) {
        console.warn('Failed to load promoted users:', rolesError);
        return [];
      }

      const promotedUserIds = promotedUsers?.map((u: any) => u.user_id) || [];

      if (promotedUserIds.length === 0) {
        return [];
      }

      const { data: productsData, error } = await supabase
        .from("products")
        .select(`
          *,
          profiles:seller_id (full_name, phone_number)
        `)
        .in("seller_id", promotedUserIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (productsData || []).map((product: any) => ({
        name: product.title,
        price: `KES ${product.price}`,
        description: product.description || "",
        seller: product.profiles?.full_name || "Unknown Seller",
        phone: product.profiles?.phone_number || "",
        image: product.photo_url || "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
        promoted: true,
      }));

      return formatted;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['homepage-services'],
    queryFn: async () => {
      const { data: promotedUsers, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("promoted", true);

      if (rolesError) {
        console.warn('Failed to load promoted users:', rolesError);
        return [];
      }

      const promotedUserIds = promotedUsers?.map((u: any) => u.user_id) || [];

      if (promotedUserIds.length === 0) {
        return [];
      }

      const { data: servicesData, error } = await supabase
        .from("services")
        .select("*")
        .in("provider_id", promotedUserIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (servicesData || []).map((service: any) => ({
        ...service,
        promoted: true,
      }));
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: houses = [], isLoading: housesLoading } = useQuery({
    queryKey: ['homepage-houses'],
    queryFn: async () => {
      const { data: promotedUsers, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("promoted", true);

      if (rolesError) {
        console.warn('Failed to load promoted users:', rolesError);
        return [];
      }

      const promotedUserIds = promotedUsers?.map((u: any) => u.user_id) || [];

      if (promotedUserIds.length === 0) {
        return [];
      }

      const { data: housesData, error } = await supabase
        .from("houses")
        .select("*")
        .in("landlord_id", promotedUserIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (housesData || []).map((house: any) => ({
        name: house.title,
        price: `KSh ${house.rent}`,
        location: house.location,
        type: house.house_type,
        hasWater: house.water === "yes",
        hasWifi: house.wifi === "yes",
        phone: house.contact_number || "",
        image: house.photo_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        promoted: true,
      }));

      return formatted;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

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
  });

  const filteredServices = services.filter((service) => {
    const price = extractPrice(service.price);
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  const filteredHouses = houses.filter((house) => {
    const price = extractPrice(house.price);
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
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

            {/* Marketplace Items */}
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Marketplace Items</h2>
                <p className="text-muted-foreground mt-1">Discover great deals on products</p>
              </div>
              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                    </Card>
                  ))}
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
              {servicesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No services found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      price={service.price}
                      description={service.description || ""}
                      category={service.category}
                      availability={service.availability}
                      contactNumber={service.contact_number}
                      photoUrl={service.photo_url || ""}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Available Houses */}
            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Available Houses</h2>
                <p className="text-muted-foreground mt-1">Browse our collection of quality homes</p>
              </div>
              {housesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </CardHeader>
                    </Card>
                  ))}
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
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
