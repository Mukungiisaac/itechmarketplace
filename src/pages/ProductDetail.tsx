import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, User, Facebook, Share2, Link as LinkIcon, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (product?.id) {
      incrementViews();
      const liked = localStorage.getItem(`like_product_detail_${product.id}`) === 'true';
      setIsLiked(liked);
    }
  }, [product?.id]);

  const incrementViews = async () => {
    try {
      const { data: currentProduct } = await supabase
        .from("products")
        .select("views")
        .eq("id", product.id)
        .single();

      if (currentProduct) {
        await supabase
          .from("products")
          .update({ views: (currentProduct.views || 0) + 1 })
          .eq("id", product.id);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleLike = async () => {
    try {
      const { data: currentProduct } = await supabase
        .from("products")
        .select("likes")
        .eq("id", product.id)
        .single();

      if (currentProduct) {
        const newLikes = isLiked ? (currentProduct.likes || 0) - 1 : (currentProduct.likes || 0) + 1;
        await supabase
          .from("products")
          .update({ likes: newLikes })
          .eq("id", product.id);
        
        setIsLiked(!isLiked);
        localStorage.setItem(`like_product_detail_${product.id}`, String(!isLiked));
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (!product) {
    navigate("/");
    return null;
  }

  const handleWhatsApp = () => {
    const phoneNumber = product.phone.replace(/^0/, "254").replace(/\+/, "").replace(/\s/g, "");
    const message = encodeURIComponent(`Hi, I'm interested in ${product.name} for ${product.price}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const currentUrl = window.location.href;
  const shareText = `Check out ${product.name} for ${product.price}`;

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
        description: "Product link has been copied to clipboard",
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
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-4xl font-bold text-primary">{product.price}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Seller</p>
                    <p className="text-muted-foreground">{product.seller}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">{product.phone}</p>
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
                  {isLiked ? 'Unlike' : 'Like'} this Product
                </Button>
                
                <div className="space-y-3">
                  <p className="font-medium flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share this product
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

export default ProductDetail;
