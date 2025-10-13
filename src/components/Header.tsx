import { Link } from "react-router-dom";
import { Home, Package, Building2, Megaphone, LogIn, LayoutDashboard, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      setIsSeller(roles?.role === "seller");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-gradient-primary rounded-lg p-1.5">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-primary bg-clip-text text-transparent">Marketplace</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/houses" className="gap-2">
              <Building2 className="h-4 w-4" />
              Houses
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/services" className="gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/advertise" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Advertise
            </Link>
          </Button>
          {isSeller && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/seller-dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
        </nav>

        <Button size="sm" asChild className="gap-2">
          <Link to="/login">
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
