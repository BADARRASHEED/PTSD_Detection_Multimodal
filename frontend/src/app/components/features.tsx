"use client"; 

import React from "react";
import { FaHeartbeat, FaLock, FaClock, FaTachometerAlt } from "react-icons/fa"; 

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white " id="features" >
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-12 text-teal-600">Key Features</h2>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-teal-50 p-6 rounded-lg shadow-lg">
            <div className="text-teal-600 text-4xl mb-4">
              <FaHeartbeat />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-powered PTSD Detection</h3>
            <p className="text-gray-700">
              Leverage advanced AI algorithms to accurately detect PTSD from video data.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-teal-50 p-6 rounded-lg shadow-lg">
            <div className="text-teal-600 text-4xl mb-4">
              <FaLock />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Video Uploads</h3>
            <p className="text-gray-700">
              Upload videos securely with encrypted data protection to ensure privacy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-teal-50 p-6 rounded-lg shadow-lg">
            <div className="text-teal-600 text-4xl mb-4">
              <FaClock />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Results Analysis</h3>
            <p className="text-gray-700">
              Get instant insights into PTSD symptoms with real-time video analysis.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-teal-50 p-6 rounded-lg shadow-lg">
            <div className="text-teal-600 text-4xl mb-4">
              <FaTachometerAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">User-friendly Dashboard</h3>
            <p className="text-gray-700">
              Navigate easily through the results and data with our intuitive dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
