import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { clearMessage, login } from "../redux/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { loading, error, success, token } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validate = () => {
    let tempErrors = {};
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      tempErrors.email = "Invalid email address";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const payload = {
        email: email,
        password: password,
      }
      dispatch(login(payload))
      console.log("Form submitted", { email, password });
    }
  };

  useEffect(() => {
    // Handle success and navigate to dashboard if login is successful
    if (success && token) {
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
        dispatch(clearMessage());
      }, 1500);
    }

    // Handle error
    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [success, error, token, navigate, dispatch]);


  return (
    <div className="flex min-h-screen">
      {/* Left Side - Full Width Image */}
      <div className="hidden  h-screen lg:flex lg:w-1/2">
        <img
          src="https://preview.redd.it/hi-this-is-a-logo-for-the-task-manager-application-called-v0-si3hzlaglc7b1.png?width=640&crop=smart&auto=webp&s=04d231d246026a59f988ac183a82e0ea2ca8ef4e"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full h-screen lg:w-1/2 justify-center items-center bg-white px-20">
        <div className="w-full max-w-2xl p-12 bg-transparent">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
            Sign in to your account
          </h2>


          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md border border-black-500  focus:border-indigo-500  sm:text-sm px-2 py-3"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border border-black-500  focus:border-indigo-500  sm:text-sm px-2 py-3"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-between text-sm">
              <NavLink
                to="/forgot-password"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </NavLink>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
            <div className="grid grid-cols-2">
              <p>Don't have an account ? </p>
              <NavLink
                to="/registration"
                className="text-indigo-600 hover:text-indigo-500 text-end underline"
              >
                Register
              </NavLink>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
