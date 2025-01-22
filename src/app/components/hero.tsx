"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center bg-white">
      {/* Left Side: Text and Buttons */}
      <div className="container mx-auto px-6 py-24 relative z-10 text-black text-center md:text-left w-full md:w-1/2">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Revolutionizing PTSD Detection Through AI
        </h1>

        <p className="text-lg md:text-2xl mb-6">
          Empowering doctors with secure video analysis for accurate PTSD assessment.
        </p>

        <div className="flex justify-center md:justify-start gap-4">
          <Button
            className="px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition duration-200"
            onClick={() => window.location.href = "/login"}
          >
            Get Started
          </Button>
          <Button
            className="px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition duration-200"
            onClick={() => window.location.href = "/learn-more"}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hidden md:block w-1/2 h-full bg-cover bg-center" style={{
        backgroundImage: "url('/ptsd.png')" // Replace with your desired image URL
      }}>
      </div>
    </section>
  );
};

export default Hero;
