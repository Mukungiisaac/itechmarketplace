import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import HouseCard from "@/components/HouseCard";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: null as number | null,
    maxPrice: null as number | null,
  });

  const houses = [
    {
      name: "Somoni",
      price: "KSh 3500.0",
      location: "Kisumu Ndogo",
      type: "bedsitter",
      hasWater: true,
      hasWifi: true,
      phone: "254115810222",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    },
    {
      name: "Mirema",
      price: "KSh 4500.0",
      location: "Kasarani",
      type: "one-bedroom",
      hasWater: true,
      hasWifi: true,
      phone: "254115810333",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    },
    {
      name: "Inaka",
      price: "KSh 3600.0",
      location: "Kisumu Ndogo",
      type: "bedsitter",
      hasWater: true,
      hasWifi: true,
      phone: "0789523345",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    },
    {
      name: "Lena D",
      price: "KSh 12000.0",
      location: "Behind Vichmas Hostel",
      type: "bedsitter",
      hasWater: true,
      hasWifi: true,
      phone: "0790897856",
      image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
    },
    {
      name: "Dally",
      price: "KSh 4500.0",
      location: "Past Somoni",
      type: "bedsitter",
      hasWater: true,
      hasWifi: true,
      phone: "0789786756",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    },
  ];

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

  const extractPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  };

  const filteredHouses = houses.filter((house) => {
    const price = extractPrice(house.price);
    const matchesCategory = filters.category === "all" || filters.category === "houses";
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" || 
      house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  const filteredProducts = products.filter((product) => {
    const price = extractPrice(product.price);
    const matchesCategory = filters.category === "all" || filters.category === "products";
    const matchesMinPrice = filters.minPrice === null || price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === null || price <= filters.maxPrice;
    const matchesSearch = searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSearch;
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
                placeholder="Search houses, products, services..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Available Houses */}
            {(filters.category === "all" || filters.category === "houses") && (
              <section className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Available Houses</h2>
                  <p className="text-muted-foreground mt-1">Browse our collection of quality homes</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHouses.map((house, index) => (
                    <HouseCard key={index} {...house} />
                  ))}
                </div>
              </section>
            )}

            {/* Marketplace Items */}
            {(filters.category === "all" || filters.category === "products") && (
              <section className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Marketplace Items</h2>
                  <p className="text-muted-foreground mt-1">Discover great deals on products</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={index} {...product} />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
