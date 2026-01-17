import { Booking } from '../entities/Booking';
import { Room } from '../entities/Room';
import { Guest } from '../entities/Guest';

export interface BookingRepository {
    save(booking: Booking): Promise<Booking>;
    findById(id: number): Promise<Booking | null>;
    findByGuestId(guestId: number): Promise<Booking[]>;
    findAll(): Promise<Booking[]>;
    update(booking: Booking): Promise<void>;
    delete(id: number): Promise<void>;
}

export interface RoomRepository {
    findAll(): Promise<Room[]>;
    findById(id: number): Promise<Room | null>;
    findAvailable(checkIn: Date, checkOut: Date): Promise<Room[]>;
    updateStatus(roomId: number, status: string): Promise<void>;
    delete(id: number): Promise<void>;
}

export interface GuestRepository {
    findById(id: number): Promise<Guest | null>;
}

