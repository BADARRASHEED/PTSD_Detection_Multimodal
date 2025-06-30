"use client"; 

import * as React from "react";
import Nav from "../components/nav";
import Footer from "../components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

const Contact: React.FC = () => {
  return (
    <>
      <Nav />
      <section className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-teal-600 text-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Need Access?</h2>
          <p className="text-lg mb-2">Reach out to the admin:</p>
          
          <div className="bg-white text-teal-800 p-4 rounded-lg shadow-md w-full">
            <p className="text-lg font-medium">
              <span className="font-semibold">Email:</span> admin@example.com
            </p>
            <p className="text-lg font-medium mt-2">
              <span className="font-semibold">Phone:</span> +123 456 7890
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
