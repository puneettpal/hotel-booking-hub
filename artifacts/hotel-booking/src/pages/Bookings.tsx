import { MainLayout } from "@/components/layout/MainLayout";
import { useGetMyBookings, useCancelBooking } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CreditCard, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export default function Bookings() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const bookings: any[] = [];
  const bookingsLoading = false;
  const cancelMutation = useCancelBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [user, authLoading, setLocation]);

  const handleCancel = async (id: number) => {
    if(!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelMutation.mutateAsync({ id });
      toast({ title: "Booking Cancelled" });
      queryClient.invalidateQueries({ queryKey: [`/api/bookings`] });
    } catch(err) {
      toast({ title: "Error", description: "Could not cancel booking", variant: "destructive" });
    }
  };

  if (authLoading || (user && bookingsLoading)) return <MainLayout><div className="min-h-screen flex items-center justify-center">Loading...</div></MainLayout>;
  if (!user) return null;

  return (
    <MainLayout>
      <div className="pt-24 pb-20 bg-muted/10 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold mb-8">My Bookings</h1>

          {!bookings?.length ? (
            <div className="glass-card p-12 text-center rounded-3xl">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't booked any rooms yet.</p>
              <Link href="/rooms">
                <Button size="lg" className="rounded-xl">Browse Rooms</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div key={booking.id} className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto">
                    <img 
                      src={booking.room?.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"} 
                      alt="Room" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold font-display">{booking.room?.name || 'Room'}</h3>
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-6">
                        <div className="flex items-start gap-3 text-muted-foreground text-sm">
                          <Calendar className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">Dates</p>
                            <p>{format(new Date(booking.checkIn), 'MMM dd, yyyy')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground text-sm">
                          <CreditCard className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">Total Price</p>
                            <p className="text-lg font-bold text-foreground">{formatCurrency(booking.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {booking.status !== 'cancelled' && (
                      <div className="flex justify-end pt-4 border-t border-border/50">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleCancel(booking.id)}
                          className="rounded-lg gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
