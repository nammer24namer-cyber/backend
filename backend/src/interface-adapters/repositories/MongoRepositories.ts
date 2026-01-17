import { BookingRepository, RoomRepository, GuestRepository } from '../../domain/repositories/Interfaces';
import { Booking } from '../../domain/entities/Booking';
import { Room, RoomStatus } from '../../domain/entities/Room';
import { Guest } from '../../domain/entities/Guest';
import { BookingModel, RoomModel, GuestModel } from '../../infrastructure/database/schemas';

export class MongoRoomRepository implements RoomRepository {
    async findAll(): Promise<Room[]> {
        const docs = await RoomModel.find();
        return docs.map(doc => this.mapToEntity(doc));
    }
    async findById(id: number): Promise<Room | null> {
        const doc = await RoomModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }
    async findAvailable(checkIn: Date, checkOut: Date): Promise<Room[]> {
        // Simplified availability check for now (status based)
        // In a real app, we would query overlapping bookings
        const docs = await RoomModel.find({ status: 'AVAILABLE' });
        return docs.map(doc => this.mapToEntity(doc));
    }
    async updateStatus(roomId: number, status: string): Promise<void> {
        await RoomModel.findByIdAndUpdate(roomId, { status });
    }

    async delete(id: number): Promise<void> {
        await RoomModel.findByIdAndDelete(id);
    }

    private mapToEntity(doc: any): Room {
        return new Room(
            doc._id,
            doc.roomNumber,
            doc.type,
            doc.status as RoomStatus
        );
    }
}

export class MongoGuestRepository implements GuestRepository {
    async findById(id: number): Promise<Guest | null> {
        const doc = await GuestModel.findById(id);
        if (!doc) return null;
        return new Guest(doc._id, doc.name, doc.email, doc.password, doc.phone || '', doc.nationalId || '');
    }
}

export class MongoBookingRepository implements BookingRepository {
    async save(booking: Booking): Promise<Booking> {
        // If ID is 0, it's a new booking requiring an ID.
        // We need to generate a unique numeric ID to verify persistence and allow deletion.
        if (booking.id === 0) {
            // Find max ID
            const lastBooking = await BookingModel.findOne().sort({ _id: -1 });
            const newId = lastBooking ? (lastBooking._id as number) + 1 : 1;

            await BookingModel.create({
                _id: newId,
                guest: booking.guest.id,
                room: booking.room.id,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                totalPrice: booking.totalPrice,
                status: booking.status
            });

            // Update the entity with the new ID
            booking.id = newId;
            return booking;
        } else {
            // Update existing
            await this.update(booking);
            return booking;
        }
    }

    async findById(id: number): Promise<Booking | null> {
        const doc = await BookingModel.findById(id).populate('guest').populate('room');
        if (!doc) return null;
        return this.mapToEntity(doc);
    }

    async findByGuestId(guestId: number): Promise<Booking[]> {
        const docs = await BookingModel.find({ guest: guestId }).populate('guest').populate('room');
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findAll(): Promise<Booking[]> {
        const docs = await BookingModel.find().populate('guest').populate('room');
        return docs.map(doc => this.mapToEntity(doc));
    }

    async update(booking: Booking): Promise<void> {
        await BookingModel.findByIdAndUpdate(booking.id, {
            status: booking.status,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            totalPrice: booking.totalPrice
        });
    }

    async delete(id: number): Promise<void> {
        console.log(`Attempting to delete Booking ID: ${id} (Type: ${typeof id})`);
        const result = await BookingModel.findByIdAndDelete(id);
        console.log(`Delete Result for ID ${id}:`, result ? "Found and deleted" : "Not found");
    }

    private mapToEntity(doc: any): Booking {
        // Mongoose populate replaces ID with object. Note: Room/Guest structures in DB match Entity props roughly.
        // We need to re-construct the Entity objects.

        const guestObj = doc.guest;
        const roomObj = doc.room;

        // Ensure fallback strings for potentially undefined fields from DB
        const guest = new Guest(
            guestObj._id,
            guestObj.name,
            guestObj.email,
            guestObj.password,
            guestObj.phone || '',
            guestObj.nationalId || ''
        );

        const room = new Room(
            roomObj._id,
            roomObj.roomNumber,
            roomObj.type,
            roomObj.status as RoomStatus
        );

        const booking = new Booking(
            doc._id,
            guest,
            room,
            new Date(doc.checkInDate),
            new Date(doc.checkOutDate),
            doc.status
        );

        // Ensure price from DB is used (in case logic changes)
        booking.totalPrice = doc.totalPrice;

        return booking;
    }
}
