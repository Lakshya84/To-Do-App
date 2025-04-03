import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending registration request:", formData);
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Registration response:", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/todos");
      } else {
        setError("Registration successful but no token received");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-12">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded outline-none"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded outline-none"
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
              className="w-full p-2 border rounded outline-none"
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
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-600 cursor-pointer font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
