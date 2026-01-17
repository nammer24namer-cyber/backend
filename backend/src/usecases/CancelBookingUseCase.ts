import { BookingRepository } from '../domain/repositories/Interfaces';

export class CancelBookingUseCase {
    constructor(private bookingRepo: BookingRepository) { }

    async execute(id: number): Promise<void> {
        await this.bookingRepo.delete(id);
    }
}
