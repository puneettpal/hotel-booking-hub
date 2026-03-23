import { Router } from "express";
import { db, roomsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const { checkIn, checkOut, guests, roomType } = req.query;
  let rooms = await db.select().from(roomsTable);

  if (roomType && typeof roomType === "string" && roomType !== "any") {
    rooms = rooms.filter((r) => r.type.toLowerCase() === roomType.toLowerCase());
  }

  if (guests) {
    const guestCount = parseInt(guests as string, 10);
    if (!isNaN(guestCount)) {
      rooms = rooms.filter((r) => r.maxGuests >= guestCount);
    }
  }

  res.json(
    rooms.map((r) => ({
      ...r,
      amenities: r.amenities as string[],
      createdAt: undefined,
    }))
  );
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, id)).limit(1);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  res.json({ ...room, amenities: room.amenities as string[], createdAt: undefined });
});

export default router;
