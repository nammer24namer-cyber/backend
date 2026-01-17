import mongoose, { Schema, Document } from 'mongoose';

// Room Schema
const RoomSchema = new Schema({
    _id: { type: Number, required: true }, // Using Number ID to match our domain (or we could switch to UUID/ObjectId)
    roomNumber: { type: String, required: true },
    type: {
        id: Number,
        name: String,
        description: String,
        capacity: Number,
        basePrice: Number
    },
    status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'], default: 'AVAILABLE' }
});

// Guest Schema
const GuestSchema = new Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    nationalId: { type: String }
});

// Booking Schema
const BookingSchema = new Schema({
    _id: { type: Number, required: true },
    guest: { type: Number, ref: 'Guest', required: true }, // Reference by number ID
    room: { type: Number, ref: 'Room', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' }
});

export const RoomModel = mongoose.model('Room', RoomSchema);
export const GuestModel = mongoose.model('Guest', GuestSchema);
export const BookingModel = mongoose.model('Booking', BookingSchema);
