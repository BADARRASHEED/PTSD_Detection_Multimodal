import React from "react";
import { FaUserShield, FaVideo, FaBrain, FaLock } from "react-icons/fa"; 

const Working: React.FC = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-600 mb-12">How It Works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 px-6">
          {/* Step 1 */}
          <div className="flex flex-col items-center bg-teal-50 p-8 rounded-lg shadow-lg">
            <div className="w-24 h-24 bg-teal-600 text-white rounded-md flex items-center justify-center mb-6">
              <FaUserShield className="text-3xl" /> 
            </div>
            <h3 className="text-xl font-semibold text-teal-600 mb-4">Admin Grants Access</h3>
            <p className="text-gray-700">Admin grants access to doctors to securely upload patient videos for analysis.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center bg-teal-50 p-8 rounded-lg shadow-lg">
            <div className="w-24 h-24 bg-teal-600 text-white rounded-md flex items-center justify-center mb-6">
              <FaVideo className="text-3xl" /> 
            </div>
            <h3 className="text-xl font-semibold text-teal-600 mb-4">Doctors Upload Videos</h3>
            <p className="text-gray-700">Doctors upload patient videos securely for analysis by the AI system.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center bg-teal-50 p-8 rounded-lg shadow-lg">
            <div className="w-24 h-24 bg-teal-600 text-white rounded-md flex items-center justify-center mb-6">
              <FaBrain className="text-3xl" /> 
            </div>
            <h3 className="text-xl font-semibold text-teal-600 mb-4">AI Analyzes for PTSD Symptoms</h3>
            <p className="text-gray-700">AI analyzes the videos to detect PTSD symptoms through advanced video analysis.</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center bg-teal-50 p-8 rounded-lg shadow-lg">
            <div className="w-24 h-24 bg-teal-600 text-white rounded-md flex items-center justify-center mb-6">
              <FaLock className="text-3xl" /> 
            </div>
            <h3 className="text-xl font-semibold text-teal-600 mb-4">Results Shared Securely</h3>
            <p className="text-gray-700">The results of the analysis are shared securely with the doctor for review.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
