import React from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero"; 
import Features from "./components/features"; 
import Working from "./components/working";
import Benefits from "./components/benefits"; 
import Testimonials from "./components/testinomals";
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
