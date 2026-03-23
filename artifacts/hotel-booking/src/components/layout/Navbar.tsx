import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, UserCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "glass border-b py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
              alt="LuxeStay" 
              className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
            />
            <span className={cn(
              "font-display font-bold text-2xl tracking-tight",
              isScrolled ? "text-foreground" : location === '/' ? "text-white" : "text-foreground"
            )}>
              LuxeStay
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                    (isScrolled || location !== '/') ? "text-muted-foreground" : "text-white/80 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border/50 pl-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/bookings"
                    className={cn(
                      "text-sm font-medium hover:text-primary transition-colors",
                      (isScrolled || location !== '/') ? "text-foreground" : "text-white"
                    )}
                  >
                    My Bookings
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Button 
                    variant={isScrolled || location !== '/' ? "outline" : "secondary"} 
                    className="rounded-full gap-2"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" className={cn(
                      "rounded-full",
                      !isScrolled && location === '/' && "text-white hover:text-white hover:bg-white/20"
                    )}>
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={cn(
              "md:hidden p-2 rounded-lg",
              (!isScrolled && location === '/') ? "text-white" : "text-foreground"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full border-b shadow-2xl p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground font-medium p-2 hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link
                href="/bookings"
                className="text-foreground font-medium p-2 hover:bg-muted rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-accent font-medium p-2 hover:bg-muted rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Button variant="destructive" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full mt-2">
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
