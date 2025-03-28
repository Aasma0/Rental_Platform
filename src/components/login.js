import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!loginData.email) errors.email = "Email is required";
    if (!loginData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/login",
          loginData
        );
        console.log(response.data);

        // ✅ Store token & role in local storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        toast.success("Login successful");

        setTimeout(() => {
          // Redirect user based on role
          if (response.data.role === "admin") {
            navigate("/admin-dash"); // Redirect admin to admin dashboard
          } else {
            navigate("/dash"); // Redirect user to user dashboard
          }
        }, 1000);
      } catch (error) {
        console.error(error.response.data.msg);
        toast.error(error.response.data.msg);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: 'url("image/brownBackground.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-3xl">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Section - Hidden on small screens, shown on medium and up */}
          <div
            className="hidden md:block md:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage: 'url("image/SignUp.png")',
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "400px"
            }}
          ></div>

          {/* Form Section - Full width on small screens, half on medium and up */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
            <form onSubmit={handleSubmit}>
              <ToastContainer />

              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>

              <div className="mb-6 relative">
                <label className="block text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer pt-5"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
                {errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-20 bg-brown-500 text-white py-2 rounded-md hover:bg-brown-900 transition"
                >
                  Login
                </button>
              </div>

              <div className="text-center mt-4 text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/registration"
                  className="text-brown-600 hover:underline"
                >
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;