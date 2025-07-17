"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { BASE_URL } from "../utils/api";


//Doctors interface
interface Doctor {
  doc_id: number;
  doc_name: string;
  doc_email: string;
  doc_speciality: string;
  doc_username: string;
  doc_password: string;
  doc_phone: string;
}

// Define a zod schema for doctor validation
const doctorSchema = z.object({
  doc_name: z.string().min(1, "Name is required"),
  doc_email: z.string().email("Invalid email"),
  doc_speciality: z.string().min(1, "Specialty is required"),
  doc_username: z.string().min(1, "username is required"),
  doc_phone: z.string().min(1, "phone number is required"),
  doc_password: z
    .string()
    .min(8, "password must be at least 8 characters long"),
});

export default function ManageDoctors() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({});
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});
  const [doctorToRemove, setDoctorToRemove] = useState<Doctor | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Error state for form fields
  const [errors, setErrors] = useState<Partial<Record<keyof Doctor, string>>>(
    {}
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("adminLoggedIn");
      if (!loggedIn) {
        router.replace("/admin-login");
      }
      const name = localStorage.getItem("adminUsername");
      if (name) {
        setAdminName(name);
      }
    }
  }, [router]);

  {
    /* Function to open the modal */
  }
  const handleOpenModal = () => {
    // Select the current data to validate (either newDoctor or editingDoctor)
    const dataToValidate = editingDoctor ? editingDoctor : newDoctor;
    const result = doctorSchema.safeParse(dataToValidate);

    if (!result.success) {
      // Map the validation errors to our errors state
      const fieldErrors: Partial<Record<keyof Doctor, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof Doctor;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return; // Prevent modal from opening if validation fails
    }

    // Clear any existing errors before proceeding
    setErrors({});

    // Set confirmation message
    setActionMessage(
      editingDoctor
        ? "Are you sure you want to save changes to this doctor?"
        : "Are you sure you want to add this new doctor?"
    );

    // Set appropriate action for the modal
    setModalAction(() =>
      editingDoctor
        ? () => handleSaveEdit(editingDoctor.doc_id, editingDoctor)
        : handleAddDoctor
    );

    setShowModal(true);
  };

  {
    /* Function to close the modal */
  }
  const handleCloseModal = (confirmed: boolean) => {
    if (confirmed) {
      if (doctorToRemove) {
        handleRemoveDoctor(doctorToRemove.doc_id);
      } else {
        modalAction();
      }
    }
    setShowModal(false);
    setDoctorToRemove(null);
  };

  {
    /* Function to open logout modal */
  }
  const handleOpenLogoutModal = () => {
    setActionMessage("Are you sure you want to logout?");
    setModalAction(() => handleLogout);
    setShowLogoutModal(true);
  };

  {
    /* Function to close the logout modal */
  }
  const handleCloseLogoutModal = (confirmed: boolean) => {
    if (confirmed) {
      modalAction();
    }
    setShowLogoutModal(false);
  };

  {
    /* Function to logout */
  }
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminUsername");
      window.location.href = "/admin-login";
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  {
    /* Function to open removal modal */
  }
  const handleOpenRemoveModal = (doctor: Doctor) => {
    setDoctorToRemove(doctor);
    setActionMessage(`Are you sure you want to remove ${doctor.doc_name}?`);
    setModalAction(() => () => handleRemoveDoctor(doctor.doc_id)); // Pass doc_id here
    setShowModal(true);
  };

  {
    /* Function to handle input change */
  }
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

  {
    /* Function to add doctor */
  }
  const handleAddDoctor = async () => {
    const doctorData = {
      doc_id: doctors.length + 1,
      doc_name: newDoctor.doc_name!,
      doc_speciality: newDoctor.doc_speciality!,
      doc_email: newDoctor.doc_email!,
      doc_username: newDoctor.doc_username!,
      doc_phone: newDoctor.doc_phone!,
      doc_password: newDoctor.doc_password!,
    };

    const duplicate = doctors.find(
      (d) =>
        d.doc_email === doctorData.doc_email ||
        d.doc_username === doctorData.doc_username
    );

    if (duplicate) {
      setErrorMessage("Doctor with given email or username already exists");
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/doctor/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        let msg = "Failed to add doctor";
        try {
          const err = await response.json();
          if (err && err.detail) msg = err.detail;
        } catch (e) {
          console.error(e);
        }
        setErrorMessage(msg);
        setShowErrorModal(true);
        throw new Error(msg);
      }

      const data = await response.json();
      setDoctors([...doctors, data]); // Add newly created doctor to list
      setNewDoctor({}); // Reset form
      console.log("Doctor added successfully:", data);
    } catch (error) {
      console.error("Error adding doctor:", error);
      if (!showErrorModal) {
        setErrorMessage("Failed to add doctor");
        setShowErrorModal(true);
      }
    }
  };

  {
    /* Function to edit doctor */
  }
  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor({ ...doctor });
  };

  {
    /* Function to save edit */
  }
  const handleSaveEdit = async (
    doc_id: number,
    updatedDoctor: Partial<Doctor>
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/doctor/update?doc_id=${doc_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedDoctor, doc_id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update doctor");
      }

      const data = await response.json();
      console.log("Doctor updated successfully:", data);

      // Update the local state with the new doctor data
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.doc_id === doc_id ? { ...doctor, ...updatedDoctor } : doctor
        )
      );

      // Clear errors and close modal after update
      setErrors({});
      setShowModal(false);
    } catch (error) {
      console.error("Error updating doctor:", error);

      console.log("Failed to update doctor. Please try again.");
    }
  };

  {
    /* Function to remove doctor */
  }
  async function handleRemoveDoctor(doc_id?: number) {
    if (!doc_id) {
      console.error(
        "Error: doc_id is undefined. doctorToRemove:",
        doctorToRemove
      );
      return false;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/doctor/delete?doc_id=${doc_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete doctor");

      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.doc_id !== doc_id)
      );
      console.log("Doctor deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return false;
    }
  }

  {
    /* Fetch doctors data */
  }
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors`);
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  {
    /* Function to view doctor details */
  }
  const handleViewDetails = async (doc_id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/doctors/${doc_id}`);
      if (!response.ok) throw new Error("Failed to fetch doctor details");

      const data = await response.json();
      console.log("Fetched Doctor Details:", data);

      setSelectedDoctor(data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  {
    /* Function to cancel the form */
  }
  const handleCancel = () => {
    setNewDoctor({});
    setEditingDoctor(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="flex flex-col items-center mb-8 p-4 border-b border-teal-800">
          <Image
            src="/badar.jpg"
            width={500}
            height={300}
            alt="Doctor Profile"
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">{adminName}</h2>
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
          onClick={handleOpenLogoutModal}
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
              {/* Add / Edit Doctor Form */}
              <section className="mb-6 bg-white shadow rounded p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {/* Name Field */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Name"
                      value={
                        editingDoctor?.doc_name || newDoctor.doc_name || ""
                      }
                      onChange={(e) => handleInputChange(e, "doc_name")}
                      className="p-2 border rounded"
                    />
                    {errors.doc_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doc_name}
                      </p>
                    )}
                  </div>
                  {/* doc_email Field */}
                  <div className="flex flex-col">
                    <input
                      type="email"
                      placeholder="email"
                      value={
                        editingDoctor?.doc_email || newDoctor.doc_email || ""
                      }
                      onChange={(e) => handleInputChange(e, "doc_email")}
                      className="p-2 border rounded"
                    />
                    {errors.doc_email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doc_email}
                      </p>
                    )}
                  </div>
                  {/* Specialty Field */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Specialty"
                      value={
                        editingDoctor?.doc_speciality ||
                        newDoctor.doc_speciality ||
                        ""
                      }
                      onChange={(e) => handleInputChange(e, "doc_speciality")}
                      className="p-2 border rounded"
                    />
                    {errors.doc_speciality && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doc_speciality}
                      </p>
                    )}
                  </div>
                  {/* doc_username Field */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="username"
                      value={
                        editingDoctor?.doc_username ||
                        newDoctor.doc_username ||
                        ""
                      }
                      onChange={(e) => handleInputChange(e, "doc_username")}
                      className="p-2 border rounded"
                    />
                    {errors.doc_username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doc_username}
                      </p>
                    )}
                  </div>
                  {/* doc_phone Number Field */}
                  <div className="flex flex-col">
                    <input
                      type="tel"
                      placeholder="phone Number"
                      value={
                        editingDoctor?.doc_phone || newDoctor.doc_phone || ""
                      }
                      onChange={(e) => handleInputChange(e, "doc_phone")}
                      className="p-2 border rounded"
                    />
                    {errors.doc_phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doc_phone}
                      </p>
                    )}
                  </div>
                  {/* doc_password Field */}
                  <div className="flex flex-col">
                    <input
                      type="password"
                      placeholder="password"
                      value={
                        editingDoctor?.doc_password ||
                        newDoctor.doc_password ||
                        ""
                      }
                      onChange={(e) => handleInputChange(e, "doc_password")}
                      className="p-2 border rounded"
                    />
                    {errors.doc_password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doc_password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleOpenModal}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                  >
                    {editingDoctor ? "Save Changes" : "Add Doctor"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </section>

              {/* Doctors List */}
              <section className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Doctors List
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300 text-gray-700">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Specialty</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                        <th className="py-3 px-4 text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor, index) => (
                        <tr
                          key={doctor.doc_id}
                          className={`border-b border-gray-200 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition`}
                        >
                          <td className="py-3 px-4">{doctor.doc_name}</td>
                          <td className="py-3 px-4">{doctor.doc_speciality}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleEditDoctor(doctor)}
                              className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-800 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleOpenRemoveModal(doctor)}
                              className="ml-2 px-3 py-1 text-white bg-red-600 rounded hover:bg-red-800 transition"
                            >
                              Remove
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleViewDetails(doctor.doc_id)}
                              className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-800 transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

      {/* Doctor's Detail Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
              Doctor Details
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong className="text-gray-900">Name:</strong>{" "}
                {selectedDoctor.doc_name || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">Email:</strong>{" "}
                {selectedDoctor.doc_email || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">Speciality:</strong>{" "}
                {selectedDoctor.doc_speciality || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">Username:</strong>{" "}
                {selectedDoctor.doc_username || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">Phone:</strong>{" "}
                {selectedDoctor.doc_phone || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">Password:</strong>{" "}
                {selectedDoctor.doc_password || "N/A"}
              </p>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                Close
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

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">{errorMessage}</h2>
            <div className="flex justify-end">
              <button
                onClick={handleCloseErrorModal}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
