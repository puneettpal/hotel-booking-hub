import { useParams, Link, useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { useGetRoomById, useCreateBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Check, Star, Users, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

export default function RoomDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: room, isLoading } = useGetRoomById(Number(id));
  const createBooking = useCreateBooking();

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login required", description: "Please log in to book a room", variant: "destructive" });
      setLocation("/login");
      return;
    }
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast({ title: "Dates required", description: "Please select check-in and check-out dates", variant: "destructive" });
      return;
    }

    try {
      await createBooking.mutateAsync({
        data: {
          roomId: Number(id),
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests
        }
      });
      toast({ title: "Booking Successful!", description: "Your room has been reserved." });
      setLocation("/bookings");
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message || "An error occurred", variant: "destructive" });
    }
  };

  if (isLoading) return <MainLayout><div className="min-h-screen flex items-center justify-center">Loading...</div></MainLayout>;
  if (!room) return <MainLayout><div className="min-h-screen flex items-center justify-center">Room not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="pt-20 pb-24 min-h-screen bg-background">
        
        {/* Header Image */}
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          <img 
            src={room.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"} 
            alt={room.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
          
          <div className="absolute top-6 left-6 z-10">
            <Link href="/rooms">
              <Button variant="outline" className="bg-background/50 backdrop-blur border-none hover:bg-background/80 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rooms
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
                  <span>{room.type}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-yellow-500"/> {room.rating}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">{room.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-2xl font-display font-bold mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map(item => (
                    <div key={item} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 glass-card p-6 md:p-8 rounded-3xl border-primary/20 shadow-2xl shadow-primary/5">
                <div className="mb-6 pb-6 border-b border-border flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold">{formatCurrency(room.pricePerNight)}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                    <Users className="w-4 h-4" /> Max {room.maxGuests}
                  </div>
                </div>

                <form onSubmit={handleBook} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Check-in Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <input 
                        type="date" 
                        required
                        value={bookingData.checkIn}
                        onChange={e => setBookingData(p => ({...p, checkIn: e.target.value}))}
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Check-out Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <input 
                        type="date" 
                        required
                        value={bookingData.checkOut}
                        onChange={e => setBookingData(p => ({...p, checkOut: e.target.value}))}
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Guests</label>
                    <select 
                      value={bookingData.guests}
                      onChange={e => setBookingData(p => ({...p, guests: Number(e.target.value)}))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                    >
                      {Array.from({length: room.maxGuests}).map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} Guest{i!==0&&'s'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25"
                      disabled={createBooking.isPending || !room.available}
                    >
                      {createBooking.isPending ? "Processing..." : !room.available ? "Not Available" : "Book Now"}
                    </Button>
                    {!user && <p className="text-xs text-center text-muted-foreground mt-3">You will be asked to log in.</p>}
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
