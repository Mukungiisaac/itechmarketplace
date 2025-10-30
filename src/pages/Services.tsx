import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ServiceCard from "@/components/ServiceCard";
import { Card, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Services = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoryId: categoryFromUrl || "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, categoryId: categoryFromUrl }));
      fetchCategoryName(categoryFromUrl);
    } else {
      setFilters(prev => ({ ...prev, categoryId: "all" }));
      setCategoryName("");
    }
  }, [categoryFromUrl]);

  const fetchCategoryName = async (categoryId: string) => {
    const { data } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();
    
    if (data) {
      setCategoryName(data.name);
    }
  };

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          id,
          title,
          description,
          price,
          availability,
          contact_number,
          photo_url,
          provider_id,
          category_id,
          categories (name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
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
    const matchesCategory = filters.categoryId === "all" || service.category_id === filters.categoryId;
    const matchesSearch = searchTerm === "" ||
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesMinPrice && matchesMaxPrice && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <FilterSidebar onFilterChange={setFilters} filterType="services" />
          </aside>

          <main className="space-y-12">
            <div className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search services..."
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
                    }} filterType="services" />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {categoryName ? categoryName : "Available Services"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {categoryName ? `Browse ${categoryName.toLowerCase()} services` : "Find trusted service providers near campus"}
                </p>
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
