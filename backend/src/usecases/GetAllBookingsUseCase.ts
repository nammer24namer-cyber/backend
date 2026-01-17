import { Booking } from '../domain/entities/Booking';
import { BookingRepository } from '../domain/repositories/Interfaces';

export class GetAllBookingsUseCase {
    constructor(private bookingRepo: BookingRepository) { }

    async execute(): Promise<Booking[]> {
        return await this.bookingRepo.findAll();
    }
}
