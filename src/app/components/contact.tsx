"use client"; // Add this line to mark the component as a client-side component

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-600 mb-12">Get in Touch</h2>

        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6 p-8 bg-teal-50 rounded-lg shadow-md">
            {/* Name Field */}
            <div className="flex flex-col">
              <Label htmlFor="name" className="text-lg text-teal-600">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <Label htmlFor="email" className="text-lg text-teal-600">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col">
              <Label htmlFor="message" className="text-lg text-teal-600">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="p-4 border border-gray-300 rounded-lg"
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
