import { Booking, BookingStatus } from '../domain/entities/Booking';
import { BookingRepository } from '../domain/repositories/Interfaces';

export interface UpdateBookingDTO {
    id: number;
    checkInDate?: string;
    checkOutDate?: string;
    status?: string;
    totalPrice?: number;
}

export class ModifyBookingUseCase {
    constructor(private bookingRepo: BookingRepository) { }

    async execute(dto: UpdateBookingDTO): Promise<Booking> {
        const booking = await this.bookingRepo.findById(dto.id);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (dto.checkInDate) booking.checkInDate = new Date(dto.checkInDate);
        if (dto.checkOutDate) booking.checkOutDate = new Date(dto.checkOutDate);
        if (dto.status) booking.status = dto.status as BookingStatus;
        if (dto.totalPrice !== undefined) booking.totalPrice = dto.totalPrice;

        // Recalculate price if dates changed - simplified logic here, normally would re-use pricing service
        // For this prototype we will skip full price Recalculation complexity unless needed.

        await this.bookingRepo.update(booking);
        return booking;
    }
}
