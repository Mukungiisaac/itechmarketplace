import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  phone_number: z.string().trim().min(10, "Valid phone number required").max(20),
  what_to_advertise: z.string().trim().min(1, "Please describe what you want to advertise").max(500),
  products_or_services: z.string().trim().min(1, "Please describe your products or services").max(1000),
  additional_details: z.string().trim().max(1000).optional(),
});

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    what_to_advertise: "",
    products_or_services: "",
    additional_details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = contactSchema.parse(formData);
      setIsSubmitting(true);

      const submissionData = {
        full_name: validated.full_name,
        phone_number: validated.phone_number,
        what_to_advertise: validated.what_to_advertise,
        products_or_services: validated.products_or_services,
        additional_details: validated.additional_details || "",
      };

      const { error } = await supabase
        .from("contact_submissions")
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Submission Successful!",
        description: "Our admin team will contact you soon.",
      });

      setFormData({
        full_name: "",
        phone_number: "",
        what_to_advertise: "",
        products_or_services: "",
        additional_details: "",
      });
      setIsOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit form. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90vw] max-w-md max-h-[85vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Advertise With Us</DialogTitle>
            <DialogDescription>
              Fill out the form below and our admin team will contact you
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Isaac Mukungi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+254..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="what_to_advertise">What do you want to advertise? *</Label>
              <Textarea
                id="what_to_advertise"
                value={formData.what_to_advertise}
                onChange={(e) => setFormData({ ...formData, what_to_advertise: e.target.value })}
                placeholder="e.g., Products, Houses, Services"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="products_or_services">Describe your products or services *</Label>
              <Textarea
                id="products_or_services"
                value={formData.products_or_services}
                onChange={(e) => setFormData({ ...formData, products_or_services: e.target.value })}
                placeholder="Provide details about what you offer..."
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_details">Additional Details</Label>
              <Textarea
                id="additional_details"
                value={formData.additional_details}
                onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                placeholder="Any other information you'd like to share..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactButton;
