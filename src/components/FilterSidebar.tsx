import { useState } from "react";
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

const FilterSidebar = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <Card className="p-6 h-fit sticky top-20">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="category" className="text-base font-semibold">
            Category
          </Label>
          <Select defaultValue="all">
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="houses">Houses</SelectItem>
              <SelectItem value="apartments">Apartments</SelectItem>
              <SelectItem value="products">Products</SelectItem>
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

        <Button className="w-full" size="lg">
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default FilterSidebar;
