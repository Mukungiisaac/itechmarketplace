import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  description: string;
  seller: string;
  phone: string;
  image: string;
}

const ProductCard = ({
  name,
  price,
  description,
  seller,
  phone,
  image,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="pt-2">
          <p className="text-2xl font-bold text-primary">{price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex-col items-start gap-2">
        <div className="text-sm font-medium">{seller}</div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
