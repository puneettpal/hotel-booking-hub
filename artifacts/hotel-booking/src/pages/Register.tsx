import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      toast({ title: "Account created!" });
      setLocation("/");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "An error occurred", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <img 
        src={`${import.meta.env.BASE_URL}images/abstract-mesh.png`} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
      />
      
      <div className="absolute top-8 left-8 z-10">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md p-8 glass-card rounded-3xl relative z-10 border border-border/50 shadow-2xl mt-12 mb-12">
        <div className="text-center mb-8">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
            alt="Logo" 
            className="w-12 h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-display font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join LuxeStay to book premium experiences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-primary hover:bg-primary/90 mt-2" disabled={isLoading}>
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
