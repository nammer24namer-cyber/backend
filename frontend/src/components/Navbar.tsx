import { Link } from 'react-router-dom';
import { Hotel, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
                    <Hotel />
                    <span>Hotel Mnah</span>
                </Link>
                <div className="space-x-4 flex items-center">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link to="/guest" className="hover:text-blue-600 transition">Guest</Link>
                    <Link to="/staff" className="hover:text-blue-600 transition">Staff</Link>
                    <div className="bg-gray-100 p-2 rounded-full">
                        <UserIcon size={20} />
                    </div>
                </div>
            </div>
        </nav>
    );
};
