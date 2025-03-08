"use client"; // Marking this file as a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter for navigation
import Link from "next/link";
import Nav from "../components/nav";
import Footer from "../components/footer";

export default function DoctorLogin() {
  const router = useRouter(); // Initialize router for navigation

  const [formData, setFormData] = useState({
    doc_username: "",
    doc_password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { doc_username, doc_password } = formData;

    // Check if fields are empty
    if (!doc_username.trim() || !doc_password.trim()) {
      return "Username and password cannot be empty.";
    }

    return ""; // No errors
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/doctor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      setError(""); // Clear any previous errors
      console.log("Doctor Logged In:", data);

      // Redirect to doctor dashboard
      router.push("/doctor-dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Now TypeScript knows 'err' has a 'message' property
      } else {
        setError("An unexpected error occurred.");
      }
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
              htmlFor="doc_username"
              className="block mb-2 text-sm font-medium text-[#231F20]"
            >
              Username
            </label>
            <input
              type="text"
              id="doc_username"
              name="doc_username"
              placeholder="Enter your username"
              value={formData.doc_username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="doc_password"
              className="block mb-2 text-sm font-medium text-[#231F20]"
            >
              Password
            </label>
            <input
              type="password"
              id="doc_password"
              name="doc_password"
              placeholder="Enter your password"
              value={formData.doc_password}
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
