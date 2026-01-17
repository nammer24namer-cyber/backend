import { useEffect, useState } from 'react';
import { getRooms, createBooking } from '../services/api';
import { Layout } from '../components/Layout';
import { Calendar, Users, X } from 'lucide-react';

export const GuestPage = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Set default dates to today and tomorrow
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [guests, setGuests] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        getRooms().then(data => {
            setRooms(data);
            setLoading(false);
        });
    }, []);

    const handleSearch = () => {
        if (!checkIn || !checkOut) {
            alert('Please select Check-in and Check-out dates');
            return;
        }
        setLoading(true);
        // Simulate a search delay
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const handleOpenBooking = (room: any) => {
        if (!checkIn || !checkOut) {
            alert('Please select Check-in and Check-out dates first!');
            return;
        }
        setSelectedRoom(room);
        setBookingSuccess(false);
    };

    const confirmBooking = async () => {
        if (!selectedRoom) return;

        try {
            await createBooking({
                guestId: 1, // Hardcoded for demo/guest user
                roomId: selectedRoom.id,
                checkInDate: checkIn,
                checkOutDate: checkOut
            });
            setBookingSuccess(true);
            setTimeout(() => {
                setSelectedRoom(null);
                setBookingSuccess(false);
            }, 2000);
        } catch (error) {
            alert('Failed to book room. Please try again.');
            console.error(error);
        }
    };

    return (
        <Layout>
            {/* Booking Modal */}
            {selectedRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setSelectedRoom(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        {bookingSuccess ? (
                            <div className="text-center py-8">
                                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">✓</span>
                                </div>
                                <h3 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h3>
                                <p className="text-gray-600">See you on {checkIn}!</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold mb-4">Confirm Booking</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Room</p>
                                        <p className="font-semibold text-lg">{selectedRoom.type.name}</p>
                                        <p className="text-blue-600 font-medium">${selectedRoom.type.basePrice} / night</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Check-in</p>
                                            <p className="font-semibold">{checkIn}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Check-out</p>
                                            <p className="font-semibold">{checkOut}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={confirmBooking}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                                >
                                    Confirm & Pay
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-8 bg-blue-600 text-white p-8 rounded-xl">
                <h1 className="text-3xl font-bold mb-4">Find Your Perfect Stay</h1>
                <div className="bg-white p-4 rounded-lg flex gap-4 text-black shadow-lg">
                    <div className="flex-1 flex items-center gap-2 border-r pr-4">
                        <Calendar className="text-blue-600" />
                        <div>
                            <label className="block text-xs text-gray-500">Check-in</label>
                            <input
                                type="date"
                                className="outline-none w-full"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 border-r pr-4">
                        <Calendar className="text-blue-600" />
                        <div>
                            <label className="block text-xs text-gray-500">Check-out</label>
                            <input
                                type="date"
                                className="outline-none w-full"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 pr-4">
                        <Users className="text-blue-600" />
                        <div>
                            <label className="block text-xs text-gray-500">Guests</label>
                            <select
                                className="outline-none w-full bg-transparent"
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                            >
                                <option value={1}>1 Guest</option>
                                <option value={2}>2 Guests</option>
                                <option value={3}>3 Guests</option>
                                <option value={4}>4 Guests</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition"
                    >
                        Search
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
            {loading ? <p className="text-center text-gray-500">Loading rooms...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rooms.map(room => (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={
                                        room.type.name === 'Single' ? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop' :
                                            room.type.name === 'Double' ? 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop' :
                                                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop'
                                    }
                                    alt={room.type.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                                    {room.type.name}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">{room.type.name}</h3>
                                <p className="text-gray-600 mb-4">{room.type.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-600 font-bold text-lg">${room.type.basePrice}/night</span>
                                    <button
                                        onClick={() => handleOpenBooking(room)}
                                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition active:scale-95 transform"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};
