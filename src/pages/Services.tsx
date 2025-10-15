import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const extractPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  };

  const filteredServices = services.filter((service) => {
    const price = service.price;
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
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
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                          src={service.photo_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"}
                          alt={service.title}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">{service.category}</Badge>
                          <span className="text-lg font-bold text-primary">KSh {service.price}</span>
                        </div>
                        <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Availability:</span> {service.availability}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <a href={`tel:${service.contact_number}`}>Contact: {service.contact_number}</a>
                        </Button>
                      </CardFooter>
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

export default Services;
