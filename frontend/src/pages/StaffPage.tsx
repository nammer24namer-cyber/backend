import { useEffect, useState } from 'react';
import { getBookings, deleteBooking, updateBooking } from '../services/api';
import { Layout } from '../components/Layout';
import { Calendar, User, Trash2, Edit2, X } from 'lucide-react';

export const StaffPage = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBooking, setEditingBooking] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadBookings = () => {
        setLoading(true);
        getBookings()
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteBooking(deletingId);
            setDeletingId(null);
            await loadBookings();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete booking.");
        }
    };

    const handleUpdate = async () => {
        if (!editingBooking) return;
        await updateBooking(editingBooking.id, {
            status: editingBooking.status,
            checkInDate: editingBooking.checkInDate,
            checkOutDate: editingBooking.checkOutDate,
            totalPrice: Number(editingBooking.totalPrice)
        });
        setEditingBooking(null);
        loadBookings();
    };

    return (
        <Layout>
            {/* Edit Modal */}
            {editingBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Edit Booking #{editingBooking.id}</h3>
                            <button onClick={() => setEditingBooking(null)}><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={editingBooking.status}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Check-in Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={editingBooking.checkInDate ? new Date(editingBooking.checkInDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, checkInDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Check-out Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={editingBooking.checkOutDate ? new Date(editingBooking.checkOutDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, checkOutDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Total Price ($)</label>
                                <input
                                    type="number"
                                    className="w-full border rounded p-2"
                                    value={editingBooking.totalPrice}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, totalPrice: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleUpdate}
                            className="w-full bg-blue-600 text-white py-2 rounded font-bold mt-6"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-red-600">Delete Booking?</h3>
                            <button onClick={() => setDeletingId(null)}><X size={20} /></button>
                        </div>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete Booking #{deletingId}? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="flex-1 py-2 rounded border border-gray-300 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
                <p className="text-gray-400">Manage reservations and view daily reports.</p>
            </div>

            <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>

            {loading ? <p>Loading bookings...</p> : bookings.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No bookings found yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">ID</th>
                                    <th className="p-4 font-semibold text-gray-600">Guest</th>
                                    <th className="p-4 font-semibold text-gray-600">Room</th>
                                    <th className="p-4 font-semibold text-gray-600">Dates</th>
                                    <th className="p-4 font-semibold text-gray-600">Status</th>
                                    <th className="p-4 font-semibold text-gray-600">Price</th>
                                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-500">#{booking.id}</td>
                                        <td className="p-4 font-medium flex items-center gap-2">
                                            <div className="bg-blue-100 text-blue-600 p-1 rounded-full"><User size={16} /></div>
                                            {booking.guest.name}
                                        </td>
                                        <td className="p-4">{booking.room.roomNumber} ({booking.room.type.name})</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-bold">${booking.totalPrice}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => setEditingBooking(booking)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeletingId(booking.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Layout>
    );
};
