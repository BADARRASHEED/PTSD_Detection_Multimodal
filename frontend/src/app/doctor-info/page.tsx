"use client"; // Ensure the file is treated as a client-side component

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Memoized dummy doctor data
  const dummyDoctor: Doctor = useMemo(
    () => ({
      id: 1,
      name: "Dr. John Doe",
      email: "john.doe@example.com",
      specialty: "Cardiology",
      username: "johndoe123",
      password: "password123",
      phone: "123-456-7890",
      access: true,
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setDoctor(dummyDoctor);
      setLoading(false);
    }, 1000);
  }, [dummyDoctor]);

  const handleClose = () => {
    router.push("/admin-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      {/* Breadcrumb Navigation */}
      
<div className="flex justify-center mb-6">
  <nav className="flex items-center space-x-2">
    <button
      className="text-teal-600 font-medium hover:underline"
      onClick={() => router.push("/admin-dashboard")}
    >
      Admin Dashboard
    </button>
    <span className="text-gray-400">/</span>
    <span className="text-gray-600 font-semibold">Doctor Information</span>
  </nav>
</div>

      {/* Doctor Info Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Doctor Information
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">
            Loading doctor information...
          </p>
        ) : doctor ? (
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong className="text-gray-900">Name:</strong> {doctor.name}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Email:</strong> {doctor.email}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Specialty:</strong>{" "}
              {doctor.specialty}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Phone:</strong> {doctor.phone}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Access:</strong>{" "}
              {doctor.access ? (
                <span className="text-green-600 font-semibold">Granted</span>
              ) : (
                <span className="text-red-600 font-semibold">Revoked</span>
              )}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600">No doctor data found.</p>
        )}

        {/* Close Button */}
        <div className="mt-6">
          <button
            className="w-full px-4 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
