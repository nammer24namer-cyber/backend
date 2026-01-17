import { BookingUseCase } from './BookingUseCase';
import { Booking, BookingStatus } from '../domain/entities/Booking';
import { BookingRepository, RoomRepository, GuestRepository } from '../domain/repositories/Interfaces';
import { CreateBookingDTO } from './DTOs';
import { Guest } from '../domain/entities/Guest';
import { Room, RoomStatus, RoomType } from '../domain/entities/Room';
import { UserRole } from '../domain/entities/User';

describe('BookingUseCase', () => {
    let bookingRepo: jest.Mocked<BookingRepository>;
    let roomRepo: jest.Mocked<RoomRepository>;
    let guestRepo: jest.Mocked<GuestRepository>;
    let useCase: BookingUseCase;

    beforeEach(() => {
        bookingRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByGuestId: jest.fn(),
            update: jest.fn(),
        };
        roomRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findAvailable: jest.fn(),
            updateStatus: jest.fn(),
        };
        guestRepo = {
            findById: jest.fn(),
        };

        useCase = new BookingUseCase(bookingRepo, roomRepo, guestRepo);
    });

    it('should successfully create a booking when room is available', async () => {
        // Arrange
        const guest = new Guest(1, 'John Doe', 'john@example.com', 'hash', '123', 'PASS123');
        const roomType = new RoomType(1, 'Deluxe', 'Desc', 2, 100);
        const room = new Room(101, '101', roomType, RoomStatus.AVAILABLE);

        guestRepo.findById.mockResolvedValue(guest);
        roomRepo.findById.mockResolvedValue(room);
        roomRepo.findAvailable.mockResolvedValue([room]); // Room is available

        // Mock save to return the booking with an ID
        bookingRepo.save.mockImplementation(async (b) => {
            b.id = 1;
            return b;
        });

        const dto: CreateBookingDTO = {
            guestId: 1,
            roomId: 101,
            checkInDate: '2026-02-01',
            checkOutDate: '2026-02-05'
        };

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.status).toBe(BookingStatus.PENDING);
        expect(result.totalPrice).toBe(400); // 4 nights * 100
        expect(bookingRepo.save).toHaveBeenCalled();
    });

    it('should throw error if room is not available', async () => {
        // Arrange
        const guest = new Guest(1, 'John Doe', 'john@example.com', 'hash', '123', 'PASS123');
        const roomType = new RoomType(1, 'Deluxe', 'Desc', 2, 100);
        const room = new Room(101, '101', roomType, RoomStatus.AVAILABLE);

        guestRepo.findById.mockResolvedValue(guest);
        roomRepo.findById.mockResolvedValue(room);
        roomRepo.findAvailable.mockResolvedValue([]); // No rooms available

        const dto: CreateBookingDTO = {
            guestId: 1,
            roomId: 101,
            checkInDate: '2026-02-01',
            checkOutDate: '2026-02-05'
        };

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow('Room is not available');
    });
});
