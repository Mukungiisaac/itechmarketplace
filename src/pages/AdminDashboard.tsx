import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogOut, CheckCircle, XCircle, Star, StarOff, Trash2, Bell, Phone, Mail, Eye, BarChart3, Heart, Search } from "lucide-react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  approved: boolean;
  approved_at: string | null;
  promoted: boolean;
  promoted_at: string | null;
  profiles: {
    full_name: string;
    email: string;
    phone_number: string;
  };
}

interface ContactSubmission {
  id: string;
  full_name: string;
  phone_number: string;
  what_to_advertise: string;
  products_or_services: string;
  additional_details: string | null;
  created_at: string;
  status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<UserRole[]>([]);
  const [landlords, setLandlords] = useState<UserRole[]>([]);
  const [serviceProviders, setServiceProviders] = useState<UserRole[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    products: any[];
    houses: any[];
    services: any[];
  }>({ products: [], houses: [], services: [] });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
    fetchSubmissions();
    fetchAnalytics();

    // Subscribe to real-time updates for all tables
    const productsChannel = supabase
      .channel('admin-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    const housesChannel = supabase
      .channel('admin-houses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'houses'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    const servicesChannel = supabase
      .channel('admin-services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(housesChannel);
      supabase.removeChannel(servicesChannel);
    };
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch sellers with their profiles
      const { data: sellersRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "seller");

      const { data: landlordsRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "landlord");

      const { data: serviceProvidersRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "service_provider");

      // Fetch all profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*");

      // Combine the data
      const sellersWithProfiles = (sellersRoles || []).map(role => {
        const profile = profilesData?.find(p => p.id === role.user_id);
        return {
          ...role,
          profiles: {
            full_name: profile?.full_name || "",
            email: profile?.email || "",
            phone_number: profile?.phone_number || "",
          }
        };
      });

      const landlordsWithProfiles = (landlordsRoles || []).map(role => {
        const profile = profilesData?.find(p => p.id === role.user_id);
        return {
          ...role,
          profiles: {
            full_name: profile?.full_name || "",
            email: profile?.email || "",
            phone_number: profile?.phone_number || "",
          }
        };
      });

      const serviceProvidersWithProfiles = (serviceProvidersRoles || []).map(role => {
        const profile = profilesData?.find(p => p.id === role.user_id);
        return {
          ...role,
          profiles: {
            full_name: profile?.full_name || "",
            email: profile?.email || "",
            phone_number: profile?.phone_number || "",
          }
        };
      });

      setSellers(sellersWithProfiles);
      setLandlords(landlordsWithProfiles);
      setServiceProviders(serviceProvidersWithProfiles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Submission deleted successfully.",
        variant: "success",
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: productsData } = await supabase
        .from("products")
        .select("id, title, price, photo_url, views, likes")
        .order("views", { ascending: false })
        .limit(20);

      const { data: housesData } = await supabase
        .from("houses")
        .select("id, title, rent, photo_url, views, likes")
        .order("views", { ascending: false })
        .limit(20);

      const { data: servicesData } = await supabase
        .from("services")
        .select("id, title, price, photo_url, views, likes")
        .order("views", { ascending: false })
        .limit(20);

      setAnalytics({
        products: productsData || [],
        houses: housesData || [],
        services: servicesData || [],
      });
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
    }
  };

  const filterAnalytics = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rent?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleApprove = async (userId: string, roleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("user_roles")
        .update({
          approved: true,
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        })
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User approved successfully.",
        variant: "success",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({
          approved: false,
          approved_at: null,
          approved_by: null,
        })
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User approval revoked.",
        variant: "success",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePromote = async (roleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("user_roles")
        .update({
          promoted: true,
          promoted_at: new Date().toISOString(),
          promoted_by: user?.id,
        })
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User promoted successfully. Their items will appear first on the home page.",
        variant: "success",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnpromote = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({
          promoted: false,
          promoted_at: null,
          promoted_by: null,
        })
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Promotion removed.",
        variant: "success",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to delete users",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      toast({
        title: "Success",
        description: `${userName} has been deleted along with their posts.`,
        variant: "success",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const renderUserTable = (users: UserRole[], title: string) => {
    const approved = users.filter((u) => u.approved);
    const pending = users.filter((u) => !u.approved);

    return (
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approved.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending {title}</CardTitle>
              <CardDescription>
                Review and approve new {title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No pending requests
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.profiles.full_name}</TableCell>
                        <TableCell>{user.profiles.email}</TableCell>
                        <TableCell>{user.profiles.phone_number}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.user_id, user.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete {user.profiles.full_name} and all their posts. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.user_id, user.profiles.full_name)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved {title}</CardTitle>
              <CardDescription>
                Manage approved {title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approved.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No approved users yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Approved At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approved.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.profiles.full_name}</TableCell>
                        <TableCell>{user.profiles.email}</TableCell>
                        <TableCell>{user.profiles.phone_number}</TableCell>
                        <TableCell>
                          {user.approved_at
                            ? new Date(user.approved_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {user.promoted ? (
                            <span className="flex items-center text-yellow-600 gap-1">
                              <Star className="h-4 w-4 fill-yellow-600" />
                              Promoted
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Regular</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.promoted ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnpromote(user.id)}
                              >
                                <StarOff className="h-4 w-4 mr-1" />
                                Unpromote
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handlePromote(user.id)}
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Promote
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(user.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Revoke
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete {user.profiles.full_name} and all their posts (houses/products/services). This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.user_id, user.profiles.full_name)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="sellers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-8 h-auto">
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2">
                <BarChart3 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 py-2">
                <Bell className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Ads ({submissions.filter(s => s.status === 'pending').length})</span>
                <span className="sm:hidden">({submissions.filter(s => s.status === 'pending').length})</span>
              </TabsTrigger>
              <TabsTrigger value="sellers" className="text-xs sm:text-sm px-2 py-2">Sellers</TabsTrigger>
              <TabsTrigger value="landlords" className="text-xs sm:text-sm px-2 py-2">Landlords</TabsTrigger>
              <TabsTrigger value="service-providers" className="text-xs sm:text-sm px-2 py-2">
                <span className="hidden sm:inline">Providers</span>
                <span className="sm:hidden">Services</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>View Analytics</CardTitle>
                  <CardDescription>
                    Track views and likes for each post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or price..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Products
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                          <TableHead className="text-right">Likes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterAnalytics(analytics.products).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img 
                                src={product.photo_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"} 
                                alt={product.title}
                                className="h-12 w-12 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>KES {product.price}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{product.views || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span className="font-semibold">{product.likes || 0}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Houses
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Rent</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                          <TableHead className="text-right">Likes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterAnalytics(analytics.houses).map((house) => (
                          <TableRow key={house.id}>
                            <TableCell>
                              <img 
                                src={house.photo_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&q=80"} 
                                alt={house.title}
                                className="h-12 w-12 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell>{house.title}</TableCell>
                            <TableCell>KSh {house.rent}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{house.views || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span className="font-semibold">{house.likes || 0}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Services
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                          <TableHead className="text-right">Likes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterAnalytics(analytics.services).map((service) => (
                          <TableRow key={service.id}>
                            <TableCell>
                              <img 
                                src={service.photo_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&q=80"} 
                                alt={service.title}
                                className="h-12 w-12 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell>{service.title}</TableCell>
                            <TableCell>KSh {service.price}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{service.views || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span className="font-semibold">{service.likes || 0}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Advertiser Inquiries</CardTitle>
                  <CardDescription>
                    Review contact submissions from potential advertisers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No submissions yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <Card key={submission.id} className={submission.status === 'pending' ? 'border-primary' : ''}>
                          <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-lg">{submission.full_name}</CardTitle>
                                  <div className="flex items-center gap-2 sm:hidden">
                                    {submission.status === 'pending' && (
                                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                                        New
                                      </span>
                                    )}
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete this inquiry from {submission.full_name}. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteSubmission(submission.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                                <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                                  <a href={`tel:${submission.phone_number}`} className="flex items-center gap-1 hover:text-primary">
                                    <Phone className="h-4 w-4" />
                                    {submission.phone_number}
                                  </a>
                                  <span className="text-xs">
                                    {new Date(submission.created_at).toLocaleString()}
                                  </span>
                                </CardDescription>
                              </div>
                              <div className="hidden sm:flex items-center gap-2">
                                {submission.status === 'pending' && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                    New
                                  </span>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete this inquiry from {submission.full_name}. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSubmission(submission.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-1">What to Advertise:</h4>
                              <p className="text-sm text-muted-foreground">{submission.what_to_advertise}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Products/Services:</h4>
                              <p className="text-sm text-muted-foreground">{submission.products_or_services}</p>
                            </div>
                            {submission.additional_details && (
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Additional Details:</h4>
                                <p className="text-sm text-muted-foreground">{submission.additional_details}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="sellers">
              {renderUserTable(sellers, "Sellers")}
            </TabsContent>

            <TabsContent value="landlords">
              {renderUserTable(landlords, "Landlords")}
            </TabsContent>

            <TabsContent value="service-providers">
              {renderUserTable(serviceProviders, "Service Providers")}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
