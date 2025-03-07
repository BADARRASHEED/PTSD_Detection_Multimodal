"use client"; // Marking this file as a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter for navigation
import Link from "next/link";
import Nav from "../components/nav";
import Footer from "../components/footer";

export default function DoctorLogin() {
  const router = useRouter(); // Initialize router for navigation

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Default doctor credentials
  const defaultDoctor = {
    username: "doctor",
    password: "12345",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { username, password } = formData;

    // Check if fields are empty
    if (!username.trim() || !password.trim()) {
      return "Username and password cannot be empty.";
    }

    // Username validation (at least 3 characters, only letters and numbers)
    if (!/^[a-zA-Z0-9]{3,}$/.test(username)) {
      return "Username must be at least 3 characters and contain only letters and numbers.";
    }

    // Password validation (minimum 5 characters)
    if (password.length < 5) {
      return "Password must be at least 5 characters long.";
    }

    return ""; // No errors
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if entered credentials match the default doctor credentials
    if (
      formData.username === defaultDoctor.username &&
      formData.password === defaultDoctor.password
    ) {
      setError(""); // Clear any previous errors
      console.log("Doctor Logged In:", formData);

      // Redirect to doctor dashboard
      router.push("/doctor-dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm p-6 bg-white rounded shadow-md"
        >
          <h2 className="mb-6 text-xl font-bold text-center text-[#231F20]">
            Login as Doctor
          </h2>

          {/* Display error message */}
          {error && (
            <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-[#231F20]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-[#231F20]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-[#008080] rounded-md hover:bg-teal-800"
          >
            Login
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/admin-login"
              className="text-sm text-[#231F20] hover:underline"
            >
              Login as Admin
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
