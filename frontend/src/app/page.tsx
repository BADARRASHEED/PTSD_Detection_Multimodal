import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};
import Navbar from "./components/navbar";
import Hero from "./components/hero"; 
import Features from "./components/features"; 
import Working from "./components/working";
import Benefits from "./components/benefits"; 
import Testimonials from "./components/testimonials";
import Footer from "./components/footer";

const Page: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero /> 
      <Features /> 
      <Working />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Page;
