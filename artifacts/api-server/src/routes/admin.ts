import { Router } from "express";
import { db, roomsTable, bookingsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.use(requireAdmin);

// Rooms
router.get("/rooms", async (_req, res) => {
  const rooms = await db.select().from(roomsTable);
  res.json(rooms.map((r) => ({ ...r, amenities: r.amenities as string[] })));
});

router.post("/rooms", async (req, res) => {
  const { name, type, description, pricePerNight, maxGuests, imageUrl, amenities, available } = req.body;
  if (!name || !type || !description || !pricePerNight || !maxGuests || !imageUrl) {
    res.status(400).json({ error: "All room fields are required" });
    return;
  }

  const [room] = await db
    .insert(roomsTable)
    .values({ name, type, description, pricePerNight, maxGuests, imageUrl, amenities: amenities ?? [], available: available ?? true })
    .returning();

  res.status(201).json({ ...room, amenities: room.amenities as string[] });
});

router.put("/rooms/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const { name, type, description, pricePerNight, maxGuests, imageUrl, amenities, available } = req.body;
  const [room] = await db
    .update(roomsTable)
    .set({ name, type, description, pricePerNight, maxGuests, imageUrl, amenities: amenities ?? [], available: available ?? true })
    .where(eq(roomsTable.id, id))
    .returning();

  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json({ ...room, amenities: room.amenities as string[] });
});

router.delete("/rooms/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  await db.delete(roomsTable).where(eq(roomsTable.id, id));
  res.json({ message: "Room deleted" });
});

// Bookings
router.get("/bookings", async (_req, res) => {
  const bookings = await db.select().from(bookingsTable);
  const bookingsWithDetails = await Promise.all(
    bookings.map(async (booking) => {
      const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId)).limit(1);
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, booking.userId)).limit(1);
      return {
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        room: room ? { ...room, amenities: room.amenities as string[] } : null,
        user: user ? { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt.toISOString() } : null,
      };
    })
  );
  res.json(bookingsWithDetails);
});

export default router;
