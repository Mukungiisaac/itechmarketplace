import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Droplet, Phone } from "lucide-react";

interface HouseCardProps {
  name: string;
  price: string;
  location: string;
  type: string;
  hasWater?: boolean;
  hasWifi?: boolean;
  phone: string;
  image: string;
}

const HouseCard = ({
  name,
  price,
  location,
  type,
  hasWater,
  hasWifi,
  phone,
  image,
}: HouseCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/house-detail", { state: { name, price, location, type, hasWater, hasWifi, phone, image } });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-in-up">
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {location} | {type}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasWater && (
            <Badge variant="secondary" className="gap-1">
              <Droplet className="h-3 w-3" />
              Water
            </Badge>
          )}
          {hasWifi && (
            <Badge variant="secondary" className="gap-1">
              <Wifi className="h-3 w-3" />
              WiFi
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>

        <div className="pt-2">
          <p className="text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-105 inline-block">{price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 gap-2">
        <Button 
          variant="outline" 
          className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-md" 
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HouseCard;
