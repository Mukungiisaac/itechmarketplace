import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SetupAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const setupAdmin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-admin');

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message || "Admin account is ready",
        variant: "success",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to setup admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Initialize the admin account for first-time access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>Email:</strong> itechstudios86@gmail.com</p>
              <p><strong>Password:</strong> studios1tech</p>
            </div>
            <Button 
              onClick={setupAdmin} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Setting up..." : "Setup Admin Account"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Click the button above to create the admin account, then login with the credentials shown.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin;
