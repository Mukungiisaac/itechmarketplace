import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Heart } from "lucide-react";

interface ProductCardProps {
  id?: string;
  name: string;
  price: string;
  description: string;
  seller: string;
  phone: string;
  image: string;
  views?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  description,
  seller,
  phone,
  image,
  views = 0,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const likeKey = `like_product_${name}_${seller}`;
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem(likeKey) === 'true';
    setIsLiked(liked);
  }, [likeKey]);

  const handleViewDetails = () => {
    navigate("/product-detail", { state: { id, name, price, description, seller, phone, image } });
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    localStorage.setItem(likeKey, String(newLikedState));
    try {
      if (id) {
        const action = newLikedState ? 'like' : 'unlike';
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: 'products', id, action })
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-in-up">
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-20 bg-background/80 hover:bg-background transition-colors"
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
          <p className="text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-105 inline-block">{price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex-col items-start gap-3">
        <div className="w-full space-y-1">
          <div className="text-sm font-medium">{seller}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{phone}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md" 
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
