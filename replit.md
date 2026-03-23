# Workspace

## Overview

LuxeStay — a full-featured hotel booking platform built with React + Vite (frontend), Express.js (backend), and PostgreSQL (Drizzle ORM).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend API**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Session-based (HTTP-only cookies + sessions table)
- **Password hashing**: bcryptjs

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── hotel-booking/      # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seed script
```

## Seeded Accounts

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@luxestay.com     | admin123   |
| User  | john@example.com       | user123    |

## Features

### Frontend (artifacts/hotel-booking)
- Landing page with hero + booking search widget
- Features, Pricing, Testimonials, Footer sections
- Rooms listing with filtering
- Room detail page with booking form
- User auth (login/register)
- My Bookings page with cancellation
- Admin panel (rooms CRUD + all bookings view)
- Dark/light mode toggle
- Framer Motion animations
- Fully responsive

### Backend (artifacts/api-server)
- `GET /api/rooms` — list rooms (with query filters: checkIn, checkOut, guests, roomType)
- `GET /api/rooms/:id` — room detail
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login (sets session cookie)
- `POST /api/auth/logout` — logout (clears session cookie)
- `GET /api/auth/me` — current user
- `GET /api/bookings` — my bookings (auth required)
- `POST /api/bookings` — create booking (auth required)
- `DELETE /api/bookings/:id` — cancel booking (auth required)
- `GET /api/admin/rooms` — all rooms (admin only)
- `POST /api/admin/rooms` — create room (admin only)
- `PUT /api/admin/rooms/:id` — update room (admin only)
- `DELETE /api/admin/rooms/:id` — delete room (admin only)
- `GET /api/admin/bookings` — all bookings with user details (admin only)

## Database Schema

- `users` — id, name, email, password_hash, role (user|admin), created_at
- `rooms` — id, name, type, description, price_per_night, max_guests, image_url, amenities (jsonb), available, rating, review_count
- `bookings` — id, user_id, room_id, check_in, check_out, guests, total_price, status (confirmed|cancelled|pending)
- `sessions` — id, user_id, token, expires_at

## Seed Data

Run seed: `pnpm --filter @workspace/scripts run seed`
DB push: `pnpm --filter @workspace/db run push`
