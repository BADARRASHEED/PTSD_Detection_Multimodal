import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Checkmark icon from React Icons
import Link from "next/link"; // Custom Link component

const Benefits: React.FC = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Benefits Section */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-teal-600 mb-8">Why Choose Our Platform?</h2>
          
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-center">
              <FaCheckCircle className="text-teal-600 mr-3" /> Early diagnosis and improved treatment plans
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-teal-600 mr-3" /> Easy-to-use interface for doctors
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-teal-600 mr-3" /> Ensures patient privacy and security
            </li>
          </ul>
        </div>

        {/* Call-to-Action Section */}
        <div className="flex flex-col items-center justify-center bg-teal-600 text-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6">Start Detecting PTSD Today</h3>
          <Link
            href="/request-access"
            className="px-8 py-3 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition duration-200"
          >
            Request Access
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
