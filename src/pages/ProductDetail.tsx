import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, User } from "lucide-react";
import Header from "@/components/Header";

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  if (!product) {
    navigate("/");
    return null;
  }

  const handleWhatsApp = () => {
    const phoneNumber = product.phone.replace(/^0/, "254").replace(/\+/, "").replace(/\s/g, "");
    const message = encodeURIComponent(`Hi, I'm interested in ${product.name} for ${product.price}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
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
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
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

              <div className="pt-4 space-y-3">
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
