import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { RoomModel, GuestModel } from './infrastructure/database/schemas';
import { MongoBookingRepository, MongoGuestRepository, MongoRoomRepository } from './interface-adapters/repositories/MongoRepositories';
import { BookingUseCase } from './usecases/BookingUseCase';
import { BookingController } from './interface-adapters/controllers/BookingController';
import { GetAllBookingsUseCase } from './usecases/GetAllBookingsUseCase';
import { CancelBookingUseCase } from './usecases/CancelBookingUseCase';
import { ModifyBookingUseCase } from './usecases/ModifyBookingUseCase';
import { RoomType, Room, RoomStatus } from './domain/entities/Room';
import { Guest } from './domain/entities/Guest';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://meek-mermaid-8defad.netlify.app'], // Allow Vite dev server
    credentials: true
}));
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Connect to Database
connectDB();

// Seeder Function
const seedDatabase = async () => {
    const roomCount = await RoomModel.countDocuments();
    if (roomCount === 0) {
        console.log("Seeding Database...");

        const roomTypes = [
            { id: 1, name: 'Single', description: 'A cozy single room', capacity: 1, basePrice: 50 },
            { id: 2, name: 'Double', description: 'A standard double room', capacity: 2, basePrice: 80 },
            { id: 3, name: 'Suite', description: 'A luxury suite', capacity: 4, basePrice: 150 },
        ];

        await RoomModel.create([
            { _id: 101, roomNumber: '101', type: roomTypes[0], status: 'AVAILABLE' },
            { _id: 102, roomNumber: '102', type: roomTypes[1], status: 'AVAILABLE' },
            { _id: 201, roomNumber: '201', type: roomTypes[2], status: 'AVAILABLE' }
        ]);

        await GuestModel.create({
            _id: 1,
            name: 'Guest User',
            email: 'guest@hotel.com',
            password: 'password',
            phone: '1234567890',
            nationalId: 'A1234567'
        });

        console.log("Database Seeded!");
    }
};

seedDatabase();

// Dependency Injection (Repo Swap)
const bookingRepo = new MongoBookingRepository();
const roomRepo = new MongoRoomRepository();
const guestRepo = new MongoGuestRepository();

const bookingUseCase = new BookingUseCase(bookingRepo, roomRepo, guestRepo);
const getAllBookingsUseCase = new GetAllBookingsUseCase(bookingRepo);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepo);
const modifyBookingUseCase = new ModifyBookingUseCase(bookingRepo);

const bookingController = new BookingController(
    bookingUseCase,
    getAllBookingsUseCase,
    cancelBookingUseCase,
    modifyBookingUseCase
);

// Routes
app.post('/api/bookings', (req, res) => bookingController.create(req, res));
app.get('/api/bookings', (req, res) => bookingController.getAll(req, res));
app.put('/api/bookings/:id', (req, res) => bookingController.update(req, res));
app.delete('/api/bookings/:id', (req, res) => bookingController.delete(req, res));

app.get('/api/rooms', async (req, res) => {
    const rooms = await roomRepo.findAll();
    res.json(rooms);
});

app.delete('/api/rooms/:id', async (req, res) => {
    const id = parseInt(req.params.id as string);
    await roomRepo.delete(id);
    res.status(204).send();
});

// Health check
app.get('/', (req, res) => {
    res.send('Hotel Reservation API is running');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
