import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  onFilterChange?: (filters: {
    categoryId: string;
    minPrice: number | null;
    maxPrice: number | null;
  }) => void;
  filterType?: "products" | "services" | "all";
}

const FilterSidebar = ({ onFilterChange, filterType = "all" }: FilterSidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [filterType]);

  const fetchCategories = async () => {
    let query = supabase
      .from("categories")
      .select("id, name");

    // Filter based on type
    const serviceCategories = [
      "Tech & Digital Services",
      "Academic Support",
      "Personal Care & Lifestyle",
      "Transport & Logistics",
      "Entertainment and Events",
      "Wellness & Support",
      "Financial Services",
      "Creative & Innovation Services"
    ];
    
    if (filterType === "products") {
      query = query.not("name", "in", `(${serviceCategories.map(c => `"${c}"`).join(",")})`);
    } else if (filterType === "services") {
      query = query.in("name", serviceCategories);
    }

    query = query.order("sort_order");

    const { data, error } = await query;

    if (!error && data) {
      setCategories(data);
    }
  };

  const handleApplyFilters = () => {
    onFilterChange?.({
      categoryId,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    });
  };

  return (
    <Card className="p-6 h-fit sticky top-20">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="category" className="text-base font-semibold">
            Category
          </Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto bg-background z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Price Range</Label>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default FilterSidebar;
