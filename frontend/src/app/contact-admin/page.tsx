"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Breadcrumbs */}
      <nav className="w-full mb-4">
        <ol className="flex space-x-2 text-sm text-gray-600">
          <li>
            <Link
              href="/doctor-dashboard"
              className="hover:underline text-teal-600"
            >
              Doctor Dashboard
            </Link>
          </li>
          <li className="text-gray-500">/ Contact Admin</li>
        </ol>
      </nav>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-xl font-bold text-center text-[#231F20]">
          Contact Admin
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-[#231F20]"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-[#231F20]"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-medium text-white bg-[#008080] rounded-md hover:bg-teal-800"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
