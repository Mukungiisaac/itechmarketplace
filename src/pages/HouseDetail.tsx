import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Home, Wifi, Droplet, Phone } from "lucide-react";
import Header from "@/components/Header";

const HouseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const house = location.state;

  if (!house) {
    navigate("/");
    return null;
  }

  const handleWhatsApp = () => {
    const phoneNumber = house.phone.replace(/^0/, "254").replace(/\+/, "").replace(/\s/g, "");
    const message = encodeURIComponent(`Hi, I'm interested in ${house.name} at ${house.location} for ${house.price}\n\nView image: ${house.image}`);
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
                src={house.image}
                alt={house.name}
                className="h-full w-full object-cover"
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

export default HouseDetail;
