import { Room } from './Room';
import { Guest } from './Guest';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED = 'CANCELLED'
}

export class Booking {
    public totalPrice: number;

    constructor(
        public id: number,
        public guest: Guest,
        public room: Room,
        public checkInDate: Date,
        public checkOutDate: Date,
        public status: BookingStatus = BookingStatus.PENDING
    ) {
        this.totalPrice = this.calculateTotal();
    }

    private calculateTotal(): number {
        const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * this.room.type.basePrice;
    }

    public confirm(): void {
        if (this.status === BookingStatus.CANCELLED) {
            throw new Error("Cannot confirm a cancelled booking");
        } // Simple validation
        this.status = BookingStatus.CONFIRMED;
    }
}
