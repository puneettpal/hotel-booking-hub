import { Router } from "express";
import { db, bookingsTable, roomsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const bookings = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.userId, user.id));

  const bookingsWithRooms = await Promise.all(
    bookings.map(async (booking) => {
      const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, booking.roomId)).limit(1);
      return {
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        room: room ? { ...room, amenities: room.amenities as string[] } : null,
      };
    })
  );

  res.json(bookingsWithRooms);
});

router.post("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const getValue = (val: any): string => {
  return Array.isArray(val) ? val[0] : String(val);
};

const roomId = Number(getValue(req.body.roomId));
const checkIn = getValue(req.body.checkIn);
const checkOut = getValue(req.body.checkOut);
const guests = Number(getValue(req.body.guests));

  if (!roomId || !checkIn || !checkOut || !guests) {
    res.status(400).json({ error: "roomId, checkIn, checkOut, and guests are required" });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId)).limit(1);
  if (!room) {
    res.status(400).json({ error: "Room not found" });
    return;
  }
  if (!room.available) {
    res.status(400).json({ error: "Room is not available" });
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) {
    res.status(400).json({ error: "Check-out must be after check-in" });
    return;
  }

  const totalPrice = nights * room.pricePerNight;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      userId: user.id,
      roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: "confirmed",
    })
    .returning();

  res.status(201).json({
    ...booking,
    createdAt: booking.createdAt.toISOString(),
    room: { ...room, amenities: room.amenities as string[] },
  });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
  10
);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  if (booking.userId !== user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await db
    .update(bookingsTable)
    .set({ status: "cancelled" })
    .where(eq(bookingsTable.id, id));

  res.json({ message: "Booking cancelled" });
});

export default router;
