import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import HouseCard from "@/components/HouseCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface House {
  id: string;
  title: string;
  location: string;
  house_type: string;
  rent: string;
  deposit: string;
  distance: number;
  water: string;
  wifi: string;
  contact_number: string;
  photo_url: string | null;
  landlord_id: string;
  views: number;
}

const Houses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoryId: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });

  const { data: houses = [], isLoading } = useQuery({
    queryKey: ['houses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("houses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const extractMinPrice = (priceStr: string): number => {
    // Extract the minimum price from range like "5000-7000" or just "5000"
    const match = priceStr.match(/(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const extractMaxPrice = (priceStr: string): number => {
    // Extract the maximum price from range like "5000-7000" or just "5000"
    const matches = priceStr.match(/(\d+)/g);
    return matches && matches.length > 1 ? parseFloat(matches[1]) : (matches ? parseFloat(matches[0]) : 0);
  };

  const filteredHouses = houses.filter((house) => {
    const minRent = extractMinPrice(house.rent);
    const maxRent = extractMaxPrice(house.rent);
    const matchesMinPrice = filters.minPrice === null || maxRent >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || minRent <= filters.maxPrice;
    const matchesSearch = searchTerm === "" || 
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.house_type.toLowerCase().includes(searchTerm.toLowerCase());
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
                placeholder="Search houses..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <section className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Available Houses</h2>
                <p className="text-muted-foreground mt-1">Browse our collection of quality homes</p>
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
              ) : filteredHouses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHouses.map((house) => (
                    <HouseCard 
                      key={house.id}
                      id={house.id}
                      name={house.title}
                      price={`KSh ${house.rent}`}
                      location={house.location}
                      type={house.house_type}
                      hasWater={house.water === "yes"}
                      hasWifi={house.wifi === "yes"}
                      phone={house.contact_number}
                      image={house.photo_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No houses available yet.</p>
              )}
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Houses;
