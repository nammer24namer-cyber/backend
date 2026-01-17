import { connectDB } from './src/infrastructure/database/mongoose';
import { BookingModel } from './src/infrastructure/database/schemas';

const inspect = async () => {
    await connectDB();
    const bookings = await BookingModel.find({});
    console.log("Current Bookings in DB:");
    console.log(JSON.stringify(bookings, null, 2));
    process.exit(0);
};

inspect();
