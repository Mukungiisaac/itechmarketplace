import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

interface ServiceCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  availability: string;
  contactNumber: string;
  photoUrl: string;
  views?: number;
}

const ServiceCard = ({
  id,
  title,
  price,
  description,
  category,
  availability,
  contactNumber,
  photoUrl,
  views = 0,
}: ServiceCardProps) => {
  const navigate = useNavigate();
  const likeKey = `like_service_${id}`;
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem(likeKey) === 'true';
    setIsLiked(liked);
  }, [likeKey]);

  const handleViewDetails = () => {
    navigate("/service-detail", { 
      state: { id, title, price, description, category, availability, contactNumber, photoUrl } 
    });
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    localStorage.setItem(likeKey, String(newLikedState));
    try {
      const action = newLikedState ? 'like' : 'unlike';
      await supabase.functions.invoke('engagement', {
        body: { table: 'services', id, action }
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-in-up">
      <div className="aspect-video overflow-hidden bg-muted relative">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 z-0" />
        )}
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
          src={photoUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-lg font-bold text-primary">KSh {price}</span>
        </div>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Availability:</span> {availability}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
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

export default ServiceCard;
