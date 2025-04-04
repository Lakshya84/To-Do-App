import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Logging in...', { autoClose: 1000 });
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      toast.success('Successfully logged in!');
      navigate("/todos");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-2 outline-none border rounded"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 outline-none border rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-[20%] cursor-pointer bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:text-blue-600 cursor-pointer font-semibold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
