import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Edit } from "lucide-react";

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    contact_number: "",
    availability: "",
    photo_url: ""
  });

  useEffect(() => {
    checkAuth();
    fetchServices();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role, approved")
      .eq("user_id", user.id)
      .single();

    if (!roles || roles.role !== "service_provider") {
      navigate("/");
      return;
    }

    setApproved(roles.approved || false);
  };

  const fetchServices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setServices(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let error;
    if (editingId) {
      // Update existing service
      const result = await supabase
        .from("services")
        .update({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          price: formData.price,
          contact_number: formData.contact_number,
          availability: formData.availability,
          photo_url: formData.photo_url
        })
        .eq("id", editingId);
      error = result.error;
    } else {
      // Insert new service
      const result = await supabase.from("services").insert({
        provider_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        contact_number: formData.contact_number,
        availability: formData.availability,
        photo_url: formData.photo_url
      });
      error = result.error;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: editingId ? "Service updated successfully!" : "Service posted successfully!",
        variant: "success"
      });
      setFormData({
        title: "",
        category: "",
        description: "",
        price: "",
        contact_number: "",
        availability: "",
        photo_url: ""
      });
      setEditingId(null);
      fetchServices();
    }

    setLoading(false);
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      category: service.category,
      description: service.description || "",
      price: service.price,
      contact_number: service.contact_number,
      availability: service.availability,
      photo_url: service.photo_url || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      price: "",
      contact_number: "",
      availability: "",
      photo_url: ""
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Service deleted successfully!",
        variant: "success"
      });
      fetchServices();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Service Provider Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        {!approved && (
          <Card className="border-yellow-500">
            <CardContent className="pt-6">
              <p className="text-yellow-600">
                Your account is pending approval. You'll be able to post services once approved.
              </p>
            </CardContent>
          </Card>
        )}

        {approved && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Service" : "Post a Service"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Professional Plumbing Services"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="laundry">Laundry</SelectItem>
                      <SelectItem value="tutoring">Tutoring</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your service in detail..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price/Rate (KES)</Label>
                  <Input
                    id="price"
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 300 or 300-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={(value) => setFormData({ ...formData, availability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      <SelectItem value="weekends">Weekends Only</SelectItem>
                      <SelectItem value="24/7">24/7 Available</SelectItem>
                      <SelectItem value="by-appointment">By Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_number">Phone Number</Label>
                  <Input
                    id="contact_number"
                    type="tel"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo_url">Service Photo URL</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo_file">Or Upload Photo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="photo_file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, photo_url: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('photo_file')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (editingId ? "Updating..." : "Posting...") : (editingId ? "Update Service" : "Post Service")}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Services</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-muted-foreground">No services posted yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="pt-6">
                      {service.photo_url && (
                        <img
                          src={service.photo_url}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Category: {service.category}</p>
                      <p className="text-sm mb-2">{service.description}</p>
                      <p className="text-lg font-bold mb-2">KES {service.price}</p>
                      <p className="text-sm mb-3">Available: {service.availability}</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(service)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(service.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
