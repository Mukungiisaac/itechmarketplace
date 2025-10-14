import { Link } from "react-router-dom";
import { Home, Package, Building2, Megaphone, LogIn, LayoutDashboard, Wrench, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/iTech-logo.png";

const Header = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [isLandlord, setIsLandlord] = useState(false);
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      setIsLandlord(roles?.role === "landlord");
      setIsServiceProvider(roles?.role === "service_provider");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={logoImage} alt="iTech Studio" className="h-10 w-10 object-contain" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">iTechMarketplace</span>
        </Link>
        
        {/* Desktop Navigation */}
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
          {isLandlord && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/landlord-dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          {isServiceProvider && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/service-provider-dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button size="sm" asChild className="gap-2 hidden md:flex">
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                  <Link to="/products" onClick={() => setIsOpen(false)}>
                    <Package className="h-5 w-5" />
                    Products
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                  <Link to="/houses" onClick={() => setIsOpen(false)}>
                    <Building2 className="h-5 w-5" />
                    Houses
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                  <Link to="/services" onClick={() => setIsOpen(false)}>
                    <Wrench className="h-5 w-5" />
                    Services
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                  <Link to="/advertise" onClick={() => setIsOpen(false)}>
                    <Megaphone className="h-5 w-5" />
                    Advertise
                  </Link>
                </Button>
                {isSeller && (
                  <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                    <Link to="/seller-dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Seller Dashboard
                    </Link>
                  </Button>
                )}
                {isLandlord && (
                  <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                    <Link to="/landlord-dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Landlord Dashboard
                    </Link>
                  </Button>
                )}
                {isServiceProvider && (
                  <Button variant="ghost" size="lg" asChild className="justify-start gap-3">
                    <Link to="/service-provider-dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Service Provider Dashboard
                    </Link>
                  </Button>
                )}
                <Button size="lg" asChild className="gap-3 mt-4">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;