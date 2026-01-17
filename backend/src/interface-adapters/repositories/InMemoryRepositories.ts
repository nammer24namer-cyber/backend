import { BookingRepository, RoomRepository, GuestRepository } from '../../domain/repositories/Interfaces';
import { Booking, BookingStatus } from '../../domain/entities/Booking';
import { Room, RoomStatus, RoomType } from '../../domain/entities/Room';
import { Guest } from '../../domain/entities/Guest';

// Seed Data
const roomTypes = [
    new RoomType(1, 'Single', 'A cozy single room', 1, 50),
    new RoomType(2, 'Double', 'A standard double room', 2, 80),
    new RoomType(3, 'Suite', 'A luxury suite', 4, 150),
];

const rooms = [
    new Room(101, '101', roomTypes[0], RoomStatus.AVAILABLE),
    new Room(102, '102', roomTypes[1], RoomStatus.AVAILABLE),
    new Room(201, '201', roomTypes[2], RoomStatus.AVAILABLE),
];

const guests = [
    new Guest(1, 'Guest User', 'guest@hotel.com', 'password', '1234567890', 'A1234567'),
];

export class InMemoryRoomRepository implements RoomRepository {
    async findAll(): Promise<Room[]> {
        return rooms;
    }
    async findById(id: number): Promise<Room | null> {
        return rooms.find(r => r.id === id) || null;
    }
    async findAvailable(checkIn: Date, checkOut: Date): Promise<Room[]> {
        // Simplified logic: assume all available rooms are available (ignoring existing bookings for this seed)
        return rooms.filter(r => r.status === RoomStatus.AVAILABLE);
    }
    async updateStatus(roomId: number, status: string): Promise<void> {
        const room = rooms.find(r => r.id === roomId);
        if (room) room.status = status as RoomStatus;
    }
}

export class InMemoryGuestRepository implements GuestRepository {
    async findById(id: number): Promise<Guest | null> {
        return guests.find(g => g.id === id) || null;
    }
}

export class InMemoryBookingRepository implements BookingRepository {
    private bookings: Booking[] = [];
    private nextId = 1;

    async save(booking: Booking): Promise<Booking> {
        booking.id = this.nextId++;
        this.bookings.push(booking);
        return booking;
    }
    async findById(id: number): Promise<Booking | null> {
        return this.bookings.find(b => b.id === id) || null;
    }
    async findByGuestId(guestId: number): Promise<Booking[]> {
        return this.bookings.filter(b => b.guest.id === guestId);
    }
    async findAll(): Promise<Booking[]> {
        return this.bookings;
    }
    async update(booking: Booking): Promise<void> {
        const index = this.bookings.findIndex(b => b.id === booking.id);
        if (index !== -1) {
            this.bookings[index] = booking;
        }
    }

    async delete(id: number): Promise<void> {
        this.bookings = this.bookings.filter(b => b.id !== id);
    }
}
