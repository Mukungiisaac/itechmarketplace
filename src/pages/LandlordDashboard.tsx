import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Edit } from "lucide-react";

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    distance: "",
    rent: "",
    deposit: "",
    house_type: "",
    water: "",
    wifi: "",
    contact_number: "",
    photo_url: ""
  });

  useEffect(() => {
    checkAuth();
    fetchHouses();
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

    if (!roles || roles.role !== "landlord") {
      navigate("/");
      return;
    }

    setApproved(roles.approved || false);
  };

  const fetchHouses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("houses")
      .select("*")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setHouses(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      const { error } = await supabase
        .from("houses")
        .update({
          title: formData.title,
          location: formData.location,
          distance: parseFloat(formData.distance),
          rent: formData.rent,
          deposit: formData.deposit,
          house_type: formData.house_type,
          water: formData.water,
          wifi: formData.wifi,
          contact_number: formData.contact_number,
          photo_url: formData.photo_url
        })
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "House updated successfully!",
          variant: "success"
        });
        setEditingId(null);
        setFormData({
          title: "",
          location: "",
          distance: "",
          rent: "",
          deposit: "",
          house_type: "",
          water: "",
          wifi: "",
          contact_number: "",
          photo_url: ""
        });
        fetchHouses();
      }
    } else {
      const { error } = await supabase.from("houses").insert({
        landlord_id: user.id,
        title: formData.title,
        location: formData.location,
        distance: parseFloat(formData.distance),
        rent: formData.rent,
        deposit: formData.deposit,
        house_type: formData.house_type,
        water: formData.water,
        wifi: formData.wifi,
        contact_number: formData.contact_number,
        photo_url: formData.photo_url
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "House posted successfully!",
          variant: "success"
        });
        setFormData({
          title: "",
          location: "",
          distance: "",
          rent: "",
          deposit: "",
          house_type: "",
          water: "",
          wifi: "",
          contact_number: "",
          photo_url: ""
        });
        fetchHouses();
      }
    }

    setLoading(false);
  };

  const handleEdit = (house: any) => {
    setEditingId(house.id);
    setFormData({
      title: house.title,
      location: house.location,
      distance: house.distance.toString(),
      rent: house.rent,
      deposit: house.deposit,
      house_type: house.house_type,
      water: house.water,
      wifi: house.wifi,
      contact_number: house.contact_number,
      photo_url: house.photo_url || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      location: "",
      distance: "",
      rent: "",
      deposit: "",
      house_type: "",
      water: "",
      wifi: "",
      contact_number: "",
      photo_url: ""
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("houses").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "House deleted successfully!",
        variant: "success"
      });
      fetchHouses();
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
          <h1 className="text-3xl font-bold text-foreground">Landlord Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        {!approved && (
          <Card className="border-yellow-500">
            <CardContent className="pt-6">
              <p className="text-yellow-600">
                Your account is pending approval. You'll be able to post houses once approved.
              </p>
            </CardContent>
          </Card>
        )}

        {approved && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit House" : "Post a House"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">House Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance from Campus (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent (KES)</Label>
                  <Input
                    id="rent"
                    type="text"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    placeholder="e.g., 5000 or 5000-7000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit Amount (KES)</Label>
                  <Input
                    id="deposit"
                    type="text"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    placeholder="e.g., 5000 or 5000-7000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="house_type">House Type</Label>
                  <Select
                    value={formData.house_type}
                    onValueChange={(value) => setFormData({ ...formData, house_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select House Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="bedsitter">Bedsitter</SelectItem>
                      <SelectItem value="one-bedroom">One Bedroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="water">Water Availability</Label>
                  <Select
                    value={formData.water}
                    onValueChange={(value) => setFormData({ ...formData, water: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Water Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wifi">WiFi Availability</Label>
                  <Select
                    value={formData.wifi}
                    onValueChange={(value) => setFormData({ ...formData, wifi: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="WiFi Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
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
                  <Label htmlFor="photo_url">House Photo URL</Label>
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
                    {loading ? (editingId ? "Updating..." : "Posting...") : (editingId ? "Update House" : "Post House")}
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
            <CardTitle>My Houses</CardTitle>
          </CardHeader>
          <CardContent>
            {houses.length === 0 ? (
              <p className="text-muted-foreground">No houses posted yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {houses.map((house) => (
                  <Card key={house.id}>
                    <CardContent className="pt-6">
                      {house.photo_url && (
                        <img
                          src={house.photo_url}
                          alt={house.title}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2">{house.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{house.location}</p>
                      <p className="text-sm mb-1">Type: {house.house_type}</p>
                      <p className="text-lg font-bold mb-2">KES {house.rent}/month</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(house)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(house.id)}
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

export default LandlordDashboard;
