import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategorySelectorProps {
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  required?: boolean;
  filterType?: "products" | "services" | "all";
}

const CategorySelector = ({
  categoryId,
  onCategoryChange,
  required = false,
  filterType = "all",
}: CategorySelectorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    let query = supabase
      .from("categories")
      .select("*");

    // Filter based on type
    const serviceCategories = [
      "Tech & Digital Services",
      "Academic Support",
      "Personal Care & Lifestyle",
      "Transport & Logistics",
      "Entertainment and Events",
      "Wellness & Support",
      "Financial Services",
      "Creative & Innovation Services",
      "Health & Personal Care",
      "Transport & Mobility",
      "Entertainment & Hobbies",
      "Repair and Maintenance",
      "Campus Events"
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

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select value={categoryId} onValueChange={onCategoryChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-background z-50">
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
