"use client"; // Add this line to mark the component as a client-side component

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Nav from "../components/nav";
import Footer from "../components/footer";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
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
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <>
    <Nav />
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-xl font-bold text-center text-[#231F20]">
          Contact Us
        </h2>

        <div className="mb-4">
          <Label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-[#231F20]"
          >
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-[#231F20]"
          >
            Email
          </Label>
          <Input
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
          <Label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-[#231F20]"
          >
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
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
    <Footer />
    </>
  );
};

export default Contact;
