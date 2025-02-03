import { useState } from "react";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // get name
  const user = localStorage.getItem('username');

  const navigate = useNavigate();

  // logout funtction
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); 

    navigate('/');
  };
  return (
    <nav className="bg-indigo-600 p-4 shadow-lg sticky top-0 z-99">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/dashboard"> <h1 className="text-white text-2xl font-bold" >DigitalBuzz</h1></NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <NavLink to="/dashboard" className="text-white hover:text-indigo-200">Dashboard</NavLink>
          <NavLink to="/task-manager" className="text-white hover:text-indigo-200">Tasks</NavLink>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              alt="Profile"
              className="w-6 h-6 rounded-full border-2 border-white"
            />
            <h6 className="text-white">{user}</h6>
            <ChevronDown className="text-white" size={20} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
              <a href="#" onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                <LogOut className="mr-2" size={16} /> Logout
              </a>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <a href="#" className="block text-white text-center py-2 hover:bg-indigo-500">Home</a>
          <a href="#" className="block text-white text-center py-2 hover:bg-indigo-500">Services</a>
          <a href="#" className="block text-white text-center py-2 hover:bg-indigo-500">Contact</a>
        </div>
      )}
    </nav>
  );
}
