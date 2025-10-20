import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, Facebook, Share2, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const ServiceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state;

  useEffect(() => {
    if (service?.id) {
      incrementViews();
    }
  }, [service?.id]);

  const incrementViews = async () => {
    try {
      const { data: currentService } = await supabase
        .from("services")
        .select("views")
        .eq("id", service.id)
        .single();

      if (currentService) {
        await supabase
          .from("services")
          .update({ views: (currentService.views || 0) + 1 })
          .eq("id", service.id);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  if (!service) {
    navigate("/services");
    return null;
  }

  const handleContact = () => {
    window.location.href = `tel:${service.contactNumber}`;
  };

  const handleWhatsApp = () => {
    const phoneNumber = service.contactNumber.replace(/^0/, "254").replace(/\+/, "").replace(/\s/g, "");
    const message = encodeURIComponent(`Hi, I'm interested in ${service.title} - ${service.category} for KSh ${service.price}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const currentUrl = window.location.href;
  const shareText = `Check out ${service.title} - ${service.category} for KSh ${service.price}`;

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
        description: "Service link has been copied to clipboard",
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
          onClick={() => navigate("/services")} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={service.photoUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                <p className="text-4xl font-bold text-primary">KSh {service.price}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Description</p>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                <div>
                  <p className="font-medium mb-1">Availability</p>
                  <p className="text-muted-foreground">{service.availability}</p>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">{service.contactNumber}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="space-y-3">
                  <p className="font-medium flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share this service
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
                  onClick={handleContact} 
                  className="w-full gap-2"
                  size="lg"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
