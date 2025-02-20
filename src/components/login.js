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
        const response = await axios.post("http://localhost:8000/auth/login", loginData);
        console.log(response.data);
  
        // ✅ Store token & role in local storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
  
        toast.success("Login successful");
  
        setTimeout(() => {
          navigate("/dash");
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
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'url("image/brownBackground.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
  {/* Container with Image and Form side by side */}
  <div className="flex bg-white w-[700px] h-[400px] rounded-lg shadow-lg">
    
    {/* Left Side: Image */}
    <div
  className="w-1/2 bg-cover bg-center rounded-l-lg top-3"
  style={{
    backgroundImage: 'url("image/SignUp.png")', // Adjust the path to your image
    backgroundSize: "contain", // Ensures the whole image fits in the div
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents image repetition
  }}
></div>


    {/* Right Side: Form */}
    <div className="w-1/2 p-8">
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
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Your Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
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
          <a href="/registration" className="text-brown-600 hover:underline">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default LoginComponent;
