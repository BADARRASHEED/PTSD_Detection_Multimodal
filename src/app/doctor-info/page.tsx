"use client"; // Ensure the file is treated as a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation instead

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  username: string;
  password: string;
  phone: string;
  access: boolean;
}

export default function DoctorInfo() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter(); // Use the router from next/navigation

  // Dummy doctor data
  const dummyDoctor: Doctor = {
    id: 1,
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    specialty: "Cardiology",
    username: "johndoe123",
    password: "password123",
    phone: "123-456-7890",
    access: true,
  };

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setDoctor(dummyDoctor);
      setLoading(false);
    }, 1000); // 1 second delay to simulate loading
  }, []);

  const handleClose = () => {
    router.push("/admin-dashboard"); // Navigate to admin-dashboard on close
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 mb-4">
        <button
          className="text-[#008080] hover:text-teal-800"
          onClick={() => router.push("/admin-dashboard")}
        >
          Admin Dashboard
        </button>
        <span className="text-[#008080]">/</span>
        <span className="text-[#008080]">Doctor Information</span>
      </nav>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-sm p-6 bg-white rounded shadow-md"
        >
          <h2 className="mb-6 text-xl font-bold text-center text-[#231F20]">
            Doctor Information
          </h2>

          {loading ? (
            <p className="mb-4 text-center">Loading doctor information...</p>
          ) : doctor ? (
            <div>
              <p>
                <strong>Name:</strong> {doctor.name}
              </p>
              <p>
                <strong>Email:</strong> {doctor.email}
              </p>
              <p>
                <strong>Specialty:</strong> {doctor.specialty}
              </p>
              <p>
                <strong>Phone:</strong> {doctor.phone}
              </p>
              <p>
                <strong>Access:</strong> {doctor.access ? "Granted" : "Revoked"}
              </p>
            </div>
          ) : (
            <p className="mb-4 text-center">No doctor data found.</p>
          )}

          <div className="card-actions justify-end mt-4">
            {/* Close Button */}
            <button
              className="w-full px-4 py-2 font-medium text-white bg-[#008080] rounded-md hover:bg-teal-800"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
