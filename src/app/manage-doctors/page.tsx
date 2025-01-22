"use client"; // Marking this file as a client-side component

import { useState } from "react";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  access: boolean;
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({});
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Doctor
  ) => {
    if (editingDoctor) {
      setEditingDoctor({ ...editingDoctor, [field]: e.target.value });
    } else {
      setNewDoctor({ ...newDoctor, [field]: e.target.value });
    }
  };

  const handleAddDoctor = () => {
    if (newDoctor.name && newDoctor.email && newDoctor.specialty) {
      setDoctors([
        ...doctors,
        {
          id: doctors.length + 1,
          name: newDoctor.name!,
          email: newDoctor.email!,
          specialty: newDoctor.specialty!,
          access: true,
        },
      ]);
      setNewDoctor({});
    } else {
      alert("Please fill all fields to add a doctor.");
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
  };

  const handleSaveEdit = () => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === editingDoctor!.id ? { ...editingDoctor! } : doc
      )
    );
    setEditingDoctor(null);
  };

  const handleRemoveDoctor = (id: number) => {
    setDoctors(doctors.filter((doctor) => doctor.id !== id));
  };

  const toggleAccess = (id: number) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, access: !doctor.access } : doctor
      )
    );
  };

  return (
    <div className="p-8" id="manage-doctors">
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>

      {/* Add / Edit Doctor Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={editingDoctor?.name || newDoctor.name || ""}
            onChange={(e) => handleInputChange(e, "name")}
            className="p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={editingDoctor?.email || newDoctor.email || ""}
            onChange={(e) => handleInputChange(e, "email")}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Specialty"
            value={editingDoctor?.specialty || newDoctor.specialty || ""}
            onChange={(e) => handleInputChange(e, "specialty")}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={editingDoctor ? handleSaveEdit : handleAddDoctor}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
        >
          {editingDoctor ? "Save Changes" : "Add Doctor"}
        </button>
        {editingDoctor && (
          <button
            onClick={() => setEditingDoctor(null)}
            className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Doctors Table */}
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Specialty</th>
            <th className="py-2 px-4 text-center">Access</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-t">
              <td className="py-2 px-4">{doctor.name}</td>
              <td className="py-2 px-4">{doctor.email}</td>
              <td className="py-2 px-4">{doctor.specialty}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => toggleAccess(doctor.id)}
                  className={`px-4 py-1 rounded ${
                    doctor.access
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {doctor.access ? "Granted" : "Revoked"}
                </button>
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEditDoctor(doctor)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-800 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveDoctor(doctor.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
