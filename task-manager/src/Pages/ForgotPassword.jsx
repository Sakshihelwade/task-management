import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, forgotPassword } from "../redux/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSendOTP = () => {
    if (!email.includes("@")) {
      setErrors("Please enter a valid email address");
      return;
    }
    setErrors("");
    const payload={
      email :email,
    }
    dispatch(forgotPassword(payload));
  };

  useEffect(() => {
    if (success) {
      toast.success("OTP sent successfully!");
      dispatch(clearMessage());
      navigate(`/reset-password?email=${email}`);
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [success, error, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Forgot Password</h2>
        {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}

        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          className="mt-1 w-full p-2 border rounded-md"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading}
          className={`mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 ${loading && 'opacity-50 cursor-not-allowed'}`}
          onClick={handleSendOTP}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
