"use client"; // Marking this file as a client-side component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  username: string;
  password: string;
  access: boolean;
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({});
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");

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
    if (
      newDoctor.name &&
      newDoctor.email &&
      newDoctor.specialty &&
      newDoctor.username &&
      newDoctor.password
    ) {
      setDoctors([
        ...doctors,
        {
          id: doctors.length + 1,
          name: newDoctor.name!,
          email: newDoctor.email!,
          specialty: newDoctor.specialty!,
          username: newDoctor.username!,
          password: newDoctor.password!,
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
    if (confirm("Are you sure you want to delete this doctor?")) {
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    }
  };

  const toggleAccess = (id: number) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, access: !doctor.access } : doctor
      )
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="flex flex-col items-center mb-8 p-4 border-b border-teal-800">
          <Image
            src="/doc3.jpg"
            width={500} // Replace with the desired width
            height={300}
            alt="Doctor Profile"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">Shamama</h2>
          <p className="text-sm">Admin</p>
        </div>
        <ul className="flex flex-col gap-2 px-4">
          <li>
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`block w-full text-left py-2 px-4 rounded ${
                activeMenu === "dashboard" ? "bg-teal-800" : "hover:bg-teal-800"
              }`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveMenu("manageDoctors")}
              className={`block w-full text-left py-2 px-4 rounded ${
                activeMenu === "manageDoctors"
                  ? "bg-teal-800"
                  : "hover:bg-teal-800"
              }`}
            >
              Manage Doctors
            </button>
          </li>
        </ul>
        <Link
          href="/login" // Replace with logout API call
          className="mt-auto text-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 m-4"
        >
          Logout
        </Link>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {activeMenu === "dashboard" ? "Dashboard" : "Manage Doctors"}
          </h1>
        </header>

        <main className="p-6">
          {/* Dashboard Content */}
          {activeMenu === "dashboard" && (
            <section className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold mb-6">
                Welcome to the Dashboard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Doctors Card */}
                <div className="p-4 bg-teal-600 text-white rounded shadow">
                  <h3 className="text-xl font-bold">Total Doctors</h3>
                  <p className="text-2xl font-semibold mt-2">
                    {doctors.length}
                  </p>
                </div>

                {/* Accessed Doctors Card */}
                <div className="p-4 bg-green-600 text-white rounded shadow">
                  <h3 className="text-xl font-bold">Accessed Doctors</h3>
                  <p className="text-2xl font-semibold mt-2">
                    {doctors.filter((doctor) => doctor.access).length}
                  </p>
                </div>

                {/* Revoked Doctors Card */}
                <div className="p-4 bg-red-600 text-white rounded shadow">
                  <h3 className="text-xl font-bold">Revoked Doctors</h3>
                  <p className="text-2xl font-semibold mt-2">
                    {doctors.filter((doctor) => !doctor.access).length}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Manage Doctors Content */}
          {activeMenu === "manageDoctors" && (
            <>
              {/* Add Doctor Form */}
              <section className="mb-6 bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold mb-4">
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
                    value={
                      editingDoctor?.specialty || newDoctor.specialty || ""
                    }
                    onChange={(e) => handleInputChange(e, "specialty")}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={editingDoctor?.username || newDoctor.username || ""}
                    onChange={(e) => handleInputChange(e, "username")}
                    className="p-2 border rounded"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={editingDoctor?.password || newDoctor.password || ""}
                    onChange={(e) => handleInputChange(e, "password")}
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
              </section>

              {/* Doctors List */}
              <section className="bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold mb-4">Doctors List</h2>
                <table className="min-w-full border rounded">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Specialty</th>
                      <th className="py-2 px-4 text-left">Username</th>
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
                        <td className="py-2 px-4">{doctor.username}</td>
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
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
