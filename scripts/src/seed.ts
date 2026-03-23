import { db, usersTable, roomsTable } from "@workspace/db";
import bcrypt from "bcryptjs";

const rooms = [
  {
    name: "Standard King Room",
    type: "Standard",
    description: "A comfortable and well-appointed room featuring a king-size bed, modern decor, and all essential amenities for a pleasant stay.",
    pricePerNight: 129,
    maxGuests: 2,
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service", "Safe"],
    available: true,
    rating: 4.3,
    reviewCount: 128,
  },
  {
    name: "Deluxe Ocean View",
    type: "Deluxe",
    description: "Enjoy breathtaking ocean views from this spacious deluxe room with premium furnishings, a private balcony, and luxurious bathroom.",
    pricePerNight: 249,
    maxGuests: 3,
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Ocean View", "Private Balcony", "Jacuzzi", "Mini Bar", "Room Service", "Breakfast Included"],
    available: true,
    rating: 4.7,
    reviewCount: 256,
  },
  {
    name: "Executive Suite",
    type: "Suite",
    description: "A sophisticated suite offering separate living and sleeping areas, a gourmet kitchen, premium amenities, and panoramic city views.",
    pricePerNight: 449,
    maxGuests: 4,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Panoramic View", "Living Room", "Kitchenette", "Jacuzzi", "Butler Service", "Airport Transfer"],
    available: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    name: "Presidential Suite",
    type: "Presidential Suite",
    description: "The pinnacle of luxury — a sprawling suite with private terrace, butler, gourmet dining, and unparalleled personalized service.",
    pricePerNight: 999,
    maxGuests: 6,
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Private Terrace", "Private Pool", "Butler Service", "Fine Dining", "Limousine", "Spa Access", "Private Gym"],
    available: true,
    rating: 5.0,
    reviewCount: 34,
  },
  {
    name: "Family Suite",
    type: "Suite",
    description: "Perfect for families, featuring two bedrooms, a spacious living area, kid-friendly amenities, and easy access to pool and recreation areas.",
    pricePerNight: 349,
    maxGuests: 5,
    imageUrl: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Two Bedrooms", "Kids Area", "Pool Access", "Room Service", "Baby Cot", "Game Console"],
    available: true,
    rating: 4.6,
    reviewCount: 142,
  },
  {
    name: "Cozy Twin Room",
    type: "Standard",
    description: "A neat and tidy room with two twin beds, ideal for friends or colleagues traveling together seeking comfort and convenience.",
    pricePerNight: 99,
    maxGuests: 2,
    imageUrl: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Air Conditioning", "Flat-screen TV", "Work Desk", "Safe"],
    available: true,
    rating: 4.1,
    reviewCount: 203,
  },
  {
    name: "Garden View Deluxe",
    type: "Deluxe",
    description: "A serene retreat overlooking our lush tropical gardens, featuring premium bedding, spa-quality bath products, and calming decor.",
    pricePerNight: 189,
    maxGuests: 2,
    imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Garden View", "Bathtub", "Mini Bar", "Coffee Machine", "Yoga Mat"],
    available: true,
    rating: 4.5,
    reviewCount: 178,
  },
  {
    name: "Penthouse Suite",
    type: "Suite",
    description: "Our exclusive top-floor penthouse with sweeping 360-degree views, private rooftop terrace, and unmatched elegance throughout.",
    pricePerNight: 799,
    maxGuests: 4,
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop",
    amenities: ["Free WiFi", "Rooftop Terrace", "360° View", "Private Bar", "Butler Service", "Spa Access", "Chef on Request"],
    available: true,
    rating: 4.9,
    reviewCount: 56,
  },
];

async function seed() {
  console.log("Seeding database...");

  // Seed admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  const existing = await db.select().from(usersTable);
  if (existing.length === 0) {
    await db.insert(usersTable).values([
      { name: "Admin User", email: "admin@luxestay.com", passwordHash, role: "admin" },
      { name: "John Doe", email: "john@example.com", passwordHash: await bcrypt.hash("user123", 12), role: "user" },
    ]);
    console.log("Users seeded");
  } else {
    console.log("Users already exist, skipping");
  }

  // Seed rooms
  const existingRooms = await db.select().from(roomsTable);
  if (existingRooms.length === 0) {
    await db.insert(roomsTable).values(rooms);
    console.log("Rooms seeded");
  } else {
    console.log("Rooms already exist, skipping");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
