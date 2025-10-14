import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogOut, CheckCircle, XCircle, Star, StarOff, Trash2 } from "lucide-react";
import Header from "@/components/Header";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<UserRole[]>([]);
  const [landlords, setLandlords] = useState<UserRole[]>([]);
  const [serviceProviders, setServiceProviders] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
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
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${userName} has been deleted along with their posts.`,
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
              <TabsTrigger value="landlords">Landlords</TabsTrigger>
              <TabsTrigger value="service-providers">Service Providers</TabsTrigger>
            </TabsList>

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
