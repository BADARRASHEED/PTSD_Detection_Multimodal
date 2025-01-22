"use client";

import { useState } from "react";
import Nav from "../components/nav";
import Footer from "../components/footer";

export default function RequestAccess() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    setSuccess(true); // Simulate form submission success
    // Add your API call logic here
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm p-6 bg-white rounded shadow-md"
        >
          {success ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Request Submitted!
              </h2>
              <p className="text-gray-700">
                Your request has been submitted. Admin will review it shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-xl font-bold text-center text-[#231F20]">
                Request Access
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-[#231F20]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-[#231F20]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="specialization"
                  className="block mb-2 text-sm font-medium text-[#231F20]"
                >
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  placeholder="Enter your specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-[#008080] rounded-md hover:bg-teal-800"
              >
                Submit Request
              </button>
            </>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}
