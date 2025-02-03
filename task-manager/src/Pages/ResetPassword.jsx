import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, resetPassword } from "../redux/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector(state => state.auth);
    const email = new URLSearchParams(location.search).get("email");

    const handleResetPassword = () => {
        if (!email.includes("@")) {
            setErrors("Please enter a valid email address");
            return;
        }
        if (otp.length < 6) {
            setErrors("Enter valid OTP");
            return;
        }
        if (newPassword.length < 6) {
            setErrors("Password must be at least 6 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrors("Passwords do not match");
            return;
        }
        setErrors("");
        const payload = {
            email: email,
            otp: otp,
            newPassword: newPassword,
        }
        dispatch(resetPassword(payload));
    };

    useEffect(() => {
        if (success) {
            toast.success("Password reset successfully!");
            dispatch(clearMessage());
            navigate("/");
        }

        if (error) {
            toast.error(error);
            dispatch(clearMessage());
        }
    }, [success, error, dispatch, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
                {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}

                <label className="block text-sm font-medium text-gray-700 mt-4">Enter OTP</label>
                <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded-md"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mt-4">New Password</label>
                <input
                    type="password"
                    className="mt-1 w-full p-2 border rounded-md"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mt-4">Confirm Password</label>
                <input
                    type="password"
                    className="mt-1 w-full p-2 border rounded-md"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className={`mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 ${loading && 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleResetPassword}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ResetPassword;
