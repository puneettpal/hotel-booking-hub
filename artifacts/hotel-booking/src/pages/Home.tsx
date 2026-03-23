import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Building, CalendarCheck, Clock, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: ""
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.checkIn) query.set("checkIn", searchParams.checkIn);
    if (searchParams.checkOut) query.set("checkOut", searchParams.checkOut);
    if (searchParams.guests) query.set("guests", searchParams.guests);
    if (searchParams.roomType) query.set("roomType", searchParams.roomType);
    
    setLocation(`/rooms?${query.toString()}`);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          {/* landing page hero scenic luxury hotel room */}
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/95"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight"
          >
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Luxury</span> Stays
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12"
          >
            Experience the future of hospitality. Seamlessly book premium rooms with real-time availability and instant confirmation.
          </motion.p>

          {/* Booking Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card max-w-5xl mx-auto rounded-3xl p-4 md:p-6"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground/80 mb-1 ml-1">Check In</label>
                <input 
                  type="date" 
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams(p => ({...p, checkIn: e.target.value}))}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground/80 mb-1 ml-1">Check Out</label>
                <input 
                  type="date" 
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams(p => ({...p, checkOut: e.target.value}))}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground/80 mb-1 ml-1">Guests</label>
                <select 
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams(p => ({...p, guests: e.target.value}))}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                </select>
              </div>
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold uppercase text-muted-foreground/80 mb-1 ml-1">Room Type</label>
                <select 
                  value={searchParams.roomType}
                  onChange={(e) => setSearchParams(p => ({...p, roomType: e.target.value}))}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  <option value="">Any Type</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential Suite">Presidential</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <Button type="submit" size="lg" className="h-[50px] w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 text-lg">
                  Search Rooms
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background relative overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}images/abstract-mesh.png`} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.03] dark:opacity-10 pointer-events-none mix-blend-screen"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">Built for the Modern Traveler</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Building, title: "Multi-hotel Support", desc: "Manage and book across different properties seamlessly from one dashboard." },
              { icon: Clock, title: "Real-time Booking", desc: "Live availability syncing ensures you never double-book a room." },
              { icon: Sparkles, title: "Instant Confirmation", desc: "Receive your booking confirmation and digital itinerary instantly." },
              { icon: ShieldCheck, title: "Secure Payments", desc: "Bank-grade encryption for all your transactions and personal data." },
              { icon: CalendarCheck, title: "Easy Management", desc: "Modify or cancel your bookings with a single click from your profile." },
              { icon: CreditCard, title: "Best Price Guarantee", desc: "We match prices if you find a better deal elsewhere for our rooms." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Pricing</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">For Hoteliers & Partners</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Basic", price: "$29", desc: "Perfect for single properties", features: ["1 Property", "Up to 50 rooms", "Basic Analytics", "Email Support"] },
              { name: "Pro", price: "$79", desc: "For growing hotel chains", popular: true, features: ["Up to 5 Properties", "Unlimited rooms", "Advanced Analytics", "24/7 Priority Support", "Custom Branding"] },
              { name: "Enterprise", price: "Custom", desc: "For massive global networks", features: ["Unlimited Properties", "Dedicated Account Manager", "API Access", "White-label Solution", "Custom Integrations"] },
            ].map((plan, i) => (
              <div key={plan.name} className={`relative p-8 rounded-3xl bg-card border ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-border/50 hover:border-primary/30'} flex flex-col`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>}
                
                <h4 className="text-2xl font-display font-bold mb-2">{plan.name}</h4>
                <p className="text-muted-foreground text-sm mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className={plan.popular ? "bg-gradient-to-r from-primary to-accent w-full rounded-xl" : "w-full rounded-xl"} variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
