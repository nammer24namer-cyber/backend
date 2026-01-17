import { Request, Response } from 'express';
import { BookingUseCase } from '../../usecases/BookingUseCase';
import { GetAllBookingsUseCase } from '../../usecases/GetAllBookingsUseCase';
import { CreateBookingDTO } from '../../usecases/DTOs';
import { CancelBookingUseCase } from '../../usecases/CancelBookingUseCase';
import { ModifyBookingUseCase } from '../../usecases/ModifyBookingUseCase';

export class BookingController {
    constructor(
        private bookingUseCase: BookingUseCase,
        private getAllBookingsUseCase: GetAllBookingsUseCase,
        private cancelBookingUseCase: CancelBookingUseCase,
        private modifyBookingUseCase: ModifyBookingUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateBookingDTO = req.body;
            const booking = await this.bookingUseCase.execute(dto);
            res.status(201).json(booking);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Unknown error' });
            }
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await this.getAllBookingsUseCase.execute();
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching bookings' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const booking = await this.modifyBookingUseCase.execute({ ...req.body, id });
            res.json(booking);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update booking' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await this.cancelBookingUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Failed to delete booking' });
        }
    }
}
