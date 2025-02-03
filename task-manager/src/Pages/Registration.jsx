import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, registration } from '../redux/auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const { loading, error, success } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate =useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        // role: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!user.name || !user.email || !user.password) {
            alert("Name, Email, and Password are required fields.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        if (user.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const payload = {
            username: user.name,
            email: user.email,
            mobileNo: user.phone,
            // role: user.role,
            password: user.password,
        };
        dispatch(registration(payload));
    };

    // response
    useEffect(() => {
        if (success) {
            toast.success(success);
            dispatch(clearMessage());
            setTimeout(() => navigate('/'), 2000); 
        }
        if (error) {
            toast.error(error);
            dispatch(clearMessage());
        }
    }, [success, error, navigate]);


    return (
        <div>
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-gray-700 font-medium">Role</label>
                        <textarea
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div> */}

                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                        >
                            Create Account
                        </button>
                    </div>

                    {loading && <p className="text-blue-500 text-center">Loading...</p>}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Registration;
