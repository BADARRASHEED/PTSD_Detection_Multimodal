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
  phone: string;
  access: boolean;
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({});
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  const [doctorToRemove, setDoctorToRemove] = useState<Doctor | null>(null); // State for the doctor to be removed
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

  const handleOpenModal = () => {
    setActionMessage(
      editingDoctor
        ? "Are you sure you want to save changes to this doctor?"
        : "Are you sure you want to add this new doctor?"
    );
    setModalAction(() => (editingDoctor ? handleSaveEdit : handleAddDoctor));
    setShowModal(true);
  };

  const handleOpenRemoveModal = (doctor: Doctor) => {
    setDoctorToRemove(doctor); // Set the doctor to remove
    setActionMessage(`Are you sure you want to remove ${doctor.name}?`);
    setModalAction(() => handleRemoveDoctor);
    setShowModal(true);
  };

  const handleOpenLogoutModal = () => {
    setActionMessage("Are you sure you want to logout?");
    setModalAction(() => handleLogout);
    setShowLogoutModal(true); // Open the logout confirmation modal
  };

  const handleCloseModal = (confirmed: boolean) => {
    if (confirmed) {
      modalAction(); // Perform the action (Save, Add, or Remove)
    }
    setShowModal(false);
    setDoctorToRemove(null); // Reset doctor to remove after modal closes
  };

  const handleCloseLogoutModal = (confirmed: boolean) => {
    if (confirmed) {
      modalAction(); // Perform the logout action
    }
    setShowLogoutModal(false);
  };

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
      newDoctor.password &&
      newDoctor.phone
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
          phone: newDoctor.phone!,
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

  const handleRemoveDoctor = () => {
    if (doctorToRemove) {
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorToRemove.id));
    }
  };

  const handleLogout = () => {
    // Handle logout action here (e.g., clear session, redirect to login, etc.)
    alert("You have logged out!");
    // Redirect to login page
    window.location.href = "/login";
  };

  const toggleAccess = (id: number) => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === id ? { ...doctor, access: !doctor.access } : doctor
      )
    );
  };

  const handleCancel = () => {
    setNewDoctor({}); // Clear the form for adding a new doctor
    setEditingDoctor(null); // Reset the editing state
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="flex flex-col items-center mb-8 p-4 border-b border-teal-800">
          <Image
            src="/doc3.jpg"
            width={500}
            height={300}
            alt="Doctor Profile"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">Shamama Tarif</h2>
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
        <button
          onClick={handleOpenLogoutModal} // Trigger logout confirmation modal
          className="mt-auto text-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 m-4"
        >
          Logout
        </button>
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
            <section className="bg-cover bg-center shadow rounded p-4">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                {/* Total Doctors Card */}
                <div className="p-4 bg-teal-600 text-white rounded shadow w-full h-48 flex flex-col justify-center items-center">
                  <p className="text-4xl font-semibold mt-2">
                    {doctors.length}
                  </p>
                  <h3 className="text-xl font-bold">Total Doctors</h3>
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
                  {/* Input fields for Name, Email, etc. */}
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
                    type="tel"
                    placeholder="Phone Number"
                    value={editingDoctor?.phone || newDoctor.phone || ""}
                    onChange={(e) => handleInputChange(e, "phone")}
                    className="p-2 border rounded"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={editingDoctor?.password || newDoctor.password || ""}
                    onChange={(e) => handleInputChange(e, "password")}
                    className="p-2 border rounded"
                  />
                  {newDoctor.password && newDoctor.password.length < 8 && (
                    <p className="text-red-500 text-sm col-span-3">
                      Password must be at least 8 characters long.
                    </p>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleOpenModal}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                  >
                    {editingDoctor ? "Save Changes" : "Add Doctor"}
                  </button>
                  <button
                    onClick={handleCancel} // Clear the form
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </section>

              {/* Doctors List */}
              <section className="bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold mb-4">Doctors List</h2>
                <table className="min-w-full border rounded">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Specialty</th>
                      <th className="py-2 px-4 text-center">Access</th>
                      <th className="py-2 px-4 text-center">Actions</th>
                      <th className="py-2 px-4 text-center">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id} className="border-t">
                        <td className="py-2 px-4">{doctor.name}</td>
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
                            onClick={() => handleOpenRemoveModal(doctor)}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                          >
                            Remove
                          </button>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <Link href="/doctor-info">
                            <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-800 mr-2">
                              View Details
                            </button>
                          </Link>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">{actionMessage}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleCloseModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
              >
                Confirm
              </button>
              <button
                onClick={() => handleCloseModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">{actionMessage}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleCloseLogoutModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
              >
                Confirm
              </button>
              <button
                onClick={() => handleCloseLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
