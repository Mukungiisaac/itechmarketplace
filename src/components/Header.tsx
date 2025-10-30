import { Link, useNavigate } from "react-router-dom";
import { Home, Package, Building2, Megaphone, LogIn, LogOut, LayoutDashboard, Wrench, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/iTech-logo.png";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const Header = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [isLandlord, setIsLandlord] = useState(false);
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isServiceCategoriesOpen, setIsServiceCategoriesOpen] = useState(false);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserRole();
    fetchProductCategories();
    fetchServiceCategories();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsLoggedIn(true);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      setIsSeller(roles?.role === "seller");
      setIsLandlord(roles?.role === "landlord");
      setIsServiceProvider(roles?.role === "service_provider");
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchProductCategories = async () => {
    const serviceCategoryNames = [
      "Tech & Digital Services",
      "Academic Support",
      "Personal Care & Lifestyle",
      "Transport & Logistics",
      "Entertainment and Events",
      "Wellness & Support",
      "Financial Services",
      "Creative & Innovation Services",
      "Health & Personal Care",
      "Transport & Mobility",
      "Entertainment & Hobbies",
      "Repair and Maintenance",
      "Campus Events",
      "Restaurant",
      "Other Services"
    ];
    
    const { data } = await supabase
      .from("categories")
      .select("id, name, description")
      .not("name", "in", `(${serviceCategoryNames.map(c => `"${c}"`).join(",")})`)
      .order("sort_order");
    
    if (data) {
      setProductCategories(data);
    }
  };

  const fetchServiceCategories = async () => {
    const serviceCategoryNames = [
      "Tech & Digital Services",
      "Academic Support",
      "Personal Care & Lifestyle",
      "Transport & Logistics",
      "Entertainment and Events",
      "Wellness & Support",
      "Financial Services",
      "Creative & Innovation Services",
      "Health & Personal Care",
      "Transport & Mobility",
      "Entertainment & Hobbies",
      "Repair and Maintenance",
      "Campus Events",
      "Restaurant",
      "Other Services"
    ];
    
    const { data } = await supabase
      .from("categories")
      .select("id, name, description")
      .in("name", serviceCategoryNames)
      .order("sort_order");
    
    if (data) {
      setServiceCategories(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsSeller(false);
    setIsLandlord(false);
    setIsServiceProvider(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-in-down">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-primary animate-spin-slow" />
            <div className="relative rounded-full bg-white p-1 flex items-center justify-center pulse-glow transition-transform duration-300 group-hover:scale-110">
              <img src={logoImage} alt="iTech Studio" className="h-7 w-7 object-contain" />
            </div>
          </div>
          <span className="gradient-text-animate font-extrabold transition-all duration-300 group-hover:tracking-wide">iTechMarketplace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
            <Link to="/" className="gap-2">
              <Home className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Home
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 gap-2 group">
                <Package className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Products
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background z-[100]">
              <DropdownMenuItem asChild>
                <Link to="/products" className="cursor-pointer">
                  All Products
                </Link>
              </DropdownMenuItem>
              {productCategories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link 
                    to={`/products?category=${category.id}`} 
                    className="cursor-pointer"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
            <Link to="/houses" className="gap-2 group">
              <Building2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Houses
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 gap-2 group">
                <Wrench className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Services
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background z-[100]">
              <DropdownMenuItem asChild>
                <Link to="/services" className="cursor-pointer">
                  All Services
                </Link>
              </DropdownMenuItem>
              {serviceCategories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link 
                    to={`/services?category=${category.id}`} 
                    className="cursor-pointer"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
            <Link to="/advertise" className="gap-2 group">
              <Megaphone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Advertise
            </Link>
          </Button>
          {isSeller && (
            <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
              <Link to="/seller-dashboard" className="gap-2 group">
                <LayoutDashboard className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Dashboard
              </Link>
            </Button>
          )}
          {isLandlord && (
            <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
              <Link to="/landlord-dashboard" className="gap-2 group">
                <LayoutDashboard className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Dashboard
              </Link>
            </Button>
          )}
          {isServiceProvider && (
            <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
              <Link to="/service-provider-dashboard" className="gap-2 group">
                <LayoutDashboard className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Dashboard
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <Button size="sm" asChild className="gap-2 hidden md:flex transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          ) : (
            <Button size="sm" onClick={handleLogout} className="gap-2 hidden md:flex transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] animate-slide-in-right">
              <nav className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3 transition-all duration-300 hover:scale-105">
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                </Button>
                <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="lg" className="justify-start gap-3 transition-all duration-300 hover:scale-105 w-full">
                      <Package className="h-5 w-5" />
                      Products
                      <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 flex flex-col gap-2 mt-2">
                    <Button variant="ghost" size="sm" asChild className="justify-start transition-all duration-300 hover:scale-105">
                      <Link to="/products" onClick={() => setIsOpen(false)}>
                        All Products
                      </Link>
                    </Button>
                    {productCategories.map((category) => (
                      <Button key={category.id} variant="ghost" size="sm" asChild className="justify-start transition-all duration-300 hover:scale-105">
                        <Link to={`/products?category=${category.id}`} onClick={() => setIsOpen(false)}>
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3 transition-all duration-300 hover:scale-105">
                  <Link to="/houses" onClick={() => setIsOpen(false)}>
                    <Building2 className="h-5 w-5" />
                    Houses
                  </Link>
                </Button>
                <Collapsible open={isServiceCategoriesOpen} onOpenChange={setIsServiceCategoriesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="lg" className="justify-start gap-3 transition-all duration-300 hover:scale-105 w-full">
                      <Wrench className="h-5 w-5" />
                      Services
                      <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-300 ${isServiceCategoriesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 flex flex-col gap-2 mt-2">
                    <Button variant="ghost" size="sm" asChild className="justify-start transition-all duration-300 hover:scale-105">
                      <Link to="/services" onClick={() => setIsOpen(false)}>
                        All Services
                      </Link>
                    </Button>
                    {serviceCategories.map((category) => (
                      <Button key={category.id} variant="ghost" size="sm" asChild className="justify-start transition-all duration-300 hover:scale-105">
                        <Link to={`/services?category=${category.id}`} onClick={() => setIsOpen(false)}>
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Button variant="ghost" size="lg" asChild className="justify-start gap-3 transition-all duration-300 hover:scale-105">
                  <Link to="/advertise" onClick={() => setIsOpen(false)}>
                    <Megaphone className="h-5 w-5" />
                    Advertise
                  </Link>
                </Button>
                {isSeller && (
                  <Button variant="ghost" size="lg" asChild className="justify-start gap-3 transition-all duration-300 hover:scale-105">
                    <Link to="/seller-dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Seller Dashboard
                    </Link>
                  </Button>
                )}
                {isLandlord && (
                  <Button variant="ghost" size="lg" asChild className="justify-start gap-3 transition-all duration-300 hover:scale-105">
                    <Link to="/landlord-dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Landlord Dashboard
                    </Link>
                  </Button>
                )}
                {isServiceProvider && (
                  <Button variant="ghost" size="lg" asChild className="justify-start gap-3 transition-all duration-300 hover:scale-105">
                    <Link to="/service-provider-dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-5 w-5" />
                      Service Provider Dashboard
                    </Link>
                  </Button>
                )}
                {!isLoggedIn ? (
                  <Button size="lg" asChild className="gap-3 mt-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => { handleLogout(); setIsOpen(false); }} className="gap-3 mt-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;