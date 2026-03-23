import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { 
  useAdminGetRooms, 
  useAdminCreateRoom, 
  useAdminUpdateRoom, 
  useAdminDeleteRoom, 
  useAdminGetBookings 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Edit, Trash, Plus, Building, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('rooms');
  
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-8">Admin Dashboard</h1>
        
        <div className="flex gap-4 mb-8 border-b border-border pb-px">
          <button 
            onClick={() => setActiveTab('rooms')}
            className={`pb-4 px-2 font-medium text-lg border-b-2 transition-all ${activeTab === 'rooms' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Manage Rooms
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-2 font-medium text-lg border-b-2 transition-all ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            All Bookings
          </button>
        </div>

        {activeTab === 'rooms' ? <RoomsManager /> : <BookingsManager />}
      </div>
    </div>
  );
}

function RoomsManager() {
  const { data: rooms, isLoading } = useAdminGetRooms();
  const deleteMutation = useAdminDeleteRoom();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if(!confirm("Delete this room?")) return;
    await deleteMutation.mutateAsync({ id });
    toast({ title: "Deleted" });
    queryClient.invalidateQueries({ queryKey: [`/api/admin/rooms`] });
  };

  const openEdit = (room: any) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingRoom(null);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Loading rooms...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Building className="text-primary"/> Inventory</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 rounded-xl"><Plus className="w-4 h-4"/> Add Room</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRoom ? "Edit Room" : "Create Room"}</DialogTitle>
            </DialogHeader>
            <RoomForm room={editingRoom} onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name & Type</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rooms?.map(room => (
              <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <img src={room.imageUrl} alt="" className="w-16 h-12 object-cover rounded-lg" />
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-foreground">{room.name}</p>
                  <p className="text-xs text-muted-foreground">{room.type}</p>
                </td>
                <td className="px-6 py-4 font-semibold">{formatCurrency(room.pricePerNight)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {room.available ? 'Available' : 'Booked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(room)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(room.id)}><Trash className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomForm({ room, onSuccess }: { room?: any, onSuccess: () => void }) {
  const createMutation = useAdminCreateRoom();
  const updateMutation = useAdminUpdateRoom();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: room?.name || "",
    type: room?.type || "Standard",
    description: room?.description || "",
    pricePerNight: room?.pricePerNight || 100,
    maxGuests: room?.maxGuests || 2,
    imageUrl: room?.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
    amenities: room?.amenities?.join(", ") || "WiFi, TV, AC",
    available: room !== undefined ? room.available : true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      maxGuests: Number(formData.maxGuests),
      amenities: formData.amenities.split(",").map((s:string) => s.trim())
    };

    try {
      if (room) {
        await updateMutation.mutateAsync({ id: room.id, data: payload });
        toast({ title: "Room Updated" });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "Room Created" });
      }
      queryClient.invalidateQueries({ queryKey: [`/api/admin/rooms`] });
      onSuccess();
    } catch(err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold">Name</label>
          <input required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-semibold">Type</label>
          <select className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})}>
            <option>Standard</option><option>Deluxe</option><option>Suite</option><option>Presidential Suite</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold">Price Per Night</label>
          <input type="number" required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.pricePerNight} onChange={e=>setFormData({...formData, pricePerNight:Number(e.target.value)})} />
        </div>
        <div>
          <label className="text-xs font-semibold">Max Guests</label>
          <input type="number" required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.maxGuests} onChange={e=>setFormData({...formData, maxGuests:Number(e.target.value)})} />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold">Image URL</label>
        <input required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.imageUrl} onChange={e=>setFormData({...formData, imageUrl:e.target.value})} />
      </div>
      <div>
        <label className="text-xs font-semibold">Amenities (comma separated)</label>
        <input required className="w-full border rounded-lg px-3 py-2 mt-1" value={formData.amenities} onChange={e=>setFormData({...formData, amenities:e.target.value})} />
      </div>
      <div>
        <label className="text-xs font-semibold">Description</label>
        <textarea required className="w-full border rounded-lg px-3 py-2 mt-1" rows={3} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="avail" checked={formData.available} onChange={e=>setFormData({...formData, available:e.target.checked})} />
        <label htmlFor="avail" className="text-sm">Available for booking</label>
      </div>
      <Button type="submit" className="w-full mt-4">{room ? "Update Room" : "Create Room"}</Button>
    </form>
  );
}

function BookingsManager() {
  const { data: bookings, isLoading } = useAdminGetBookings();

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><CalendarDays className="text-primary"/> Global Bookings</h2>
      
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Guest</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings?.map(booking => (
              <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono text-muted-foreground">#{booking.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold">{booking.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                </td>
                <td className="px-6 py-4 font-medium">{booking.room?.name}</td>
                <td className="px-6 py-4 text-xs">
                  {format(new Date(booking.checkIn), 'MM/dd/yy')} - {format(new Date(booking.checkOut), 'MM/dd/yy')}
                </td>
                <td className="px-6 py-4 font-bold">{formatCurrency(booking.totalPrice)}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
