import { useState } from "react";
import { Link, useSearch } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { useGetRooms } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Users, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Rooms() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const [params, setParams] = useState({
    checkIn: searchParams.get("checkIn") || undefined,
    checkOut: searchParams.get("checkOut") || undefined,
    guests: searchParams.get("guests") || undefined,
    roomType: searchParams.get("roomType") || undefined,
  });

  const { data: rooms, isLoading, error } = useGetRooms(params);

  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-muted/20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Available Rooms</h1>
            
            {/* Filter Bar */}
            <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Type</label>
                <select 
                  value={params.roomType || ""}
                  onChange={e => setParams(p => ({...p, roomType: e.target.value || undefined}))}
                  className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">All Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Guests</label>
                <select 
                  value={params.guests || ""}
                  onChange={e => setParams(p => ({...p, guests: e.target.value || undefined}))}
                  className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Any</option>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="h-[400px] bg-card border rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive bg-destructive/10 rounded-3xl">
              Failed to load rooms.
            </div>
          ) : rooms?.length === 0 ? (
            <div className="text-center py-32 bg-card rounded-3xl border">
              <h3 className="text-xl font-bold text-foreground mb-2">No rooms available</h3>
              <p className="text-muted-foreground">Try adjusting your dates or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms?.map((room, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={room.id} 
                  className="group bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={room.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {room.rating} <span className="text-muted-foreground font-normal">({room.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1 block">{room.type}</span>
                        <h3 className="text-xl font-display font-bold text-foreground leading-tight">{room.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> Max {room.maxGuests} guests</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {room.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div>
                        <span className="text-2xl font-bold text-foreground">{formatCurrency(room.pricePerNight)}</span>
                        <span className="text-muted-foreground text-sm">/night</span>
                      </div>
                      <Link href={`/rooms/${room.id}`}>
                        <Button className="rounded-xl group/btn hover:pr-4 transition-all">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all absolute right-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
