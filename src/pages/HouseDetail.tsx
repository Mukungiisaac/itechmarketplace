import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Home, Wifi, Droplet, Phone, Facebook, Share2, Link as LinkIcon, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const HouseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const house = location.state;
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (house?.id) {
      incrementViews();
      const liked = localStorage.getItem(`like_house_detail_${house.id}`) === 'true';
      setIsLiked(liked);
    }
  }, [house?.id]);

  const incrementViews = async () => {
    try {
      const { data: currentHouse } = await supabase
        .from("houses")
        .select("views")
        .eq("id", house.id)
        .single();

      if (currentHouse) {
        await supabase
          .from("houses")
          .update({ views: (currentHouse.views || 0) + 1 })
          .eq("id", house.id);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleLike = async () => {
    try {
      const { data: currentHouse } = await supabase
        .from("houses")
        .select("likes")
        .eq("id", house.id)
        .single();

      if (currentHouse) {
        const newLikes = isLiked ? (currentHouse.likes || 0) - 1 : (currentHouse.likes || 0) + 1;
        await supabase
          .from("houses")
          .update({ likes: newLikes })
          .eq("id", house.id);
        
        setIsLiked(!isLiked);
        localStorage.setItem(`like_house_detail_${house.id}`, String(!isLiked));
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (!house) {
    navigate("/");
    return null;
  }

  const handleWhatsApp = () => {
    const phoneNumber = house.phone.replace(/^0/, "254").replace(/\+/, "").replace(/\s/g, "");
    const message = encodeURIComponent(`Hi, I'm interested in ${house.name} at ${house.location} for ${house.price}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const currentUrl = window.location.href;
  const shareText = `Check out ${house.name} at ${house.location} for ${house.price}`;

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const handleShareX = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link copied!",
        description: "House link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 md:px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg bg-muted">
              <img
                src={house.image}
                alt={house.name}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{house.name}</h1>
                <p className="text-4xl font-bold text-primary">{house.price}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{house.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Property Type</p>
                    <p className="text-muted-foreground capitalize">{house.type}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Amenities</p>
                  <div className="flex gap-2 flex-wrap">
                    {house.hasWater && (
                      <Badge variant="secondary" className="gap-1">
                        <Droplet className="h-3 w-3" />
                        Water Available
                      </Badge>
                    )}
                    {house.hasWifi && (
                      <Badge variant="secondary" className="gap-1">
                        <Wifi className="h-3 w-3" />
                        WiFi Available
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">{house.phone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className="w-full gap-2"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {isLiked ? 'Unlike' : 'Like'} this House
                </Button>
                
                <div className="space-y-3">
                  <p className="font-medium flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share this house
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareFacebook}
                      title="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareX}
                      title="Share on X"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareWhatsApp}
                      title="Share on WhatsApp"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      title="Copy link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleWhatsApp} 
                  className="w-full gap-2"
                  size="lg"
                >
                  <Phone className="h-4 w-4" />
                  Contact via WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")} 
                  className="w-full"
                  size="lg"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HouseDetail;
