import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ServiceCard from "@/components/ServiceCard";
import { Card, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoryId: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const extractMinPrice = (priceStr: string): number => {
    // Extract the minimum price from range like "300-400" or just "300"
    const match = priceStr.match(/(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const extractMaxPrice = (priceStr: string): number => {
    // Extract the maximum price from range like "300-400" or just "300"
    const matches = priceStr.match(/(\d+)/g);
    return matches && matches.length > 1 ? parseFloat(matches[1]) : (matches ? parseFloat(matches[0]) : 0);
  };

  const filteredServices = services.filter((service) => {
    const minPrice = extractMinPrice(service.price);
    const maxPrice = extractMaxPrice(service.price);
    const matchesMinPrice = filters.minPrice === null || maxPrice >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || minPrice <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
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
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Available Services</h2>
                <p className="text-muted-foreground mt-1">Find trusted service providers near campus</p>
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
              ) : filteredServices.length === 0 ? (
                <p className="text-center text-muted-foreground">No services found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      price={service.price}
                      description={service.description || ""}
                      category={service.categories?.name || "Uncategorized"}
                      availability={service.availability}
                      contactNumber={service.contact_number}
                      photoUrl={service.photo_url || ""}
                    />
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

export default Services;
