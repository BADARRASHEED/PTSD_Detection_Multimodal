export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

export const createDoctor = async (doctorData) => {
  const response = await fetch(`${BASE_URL}/doctor/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctorData),
  });

  return response.json();
};

export const getDoctor = async (docId) => {
  const response = await fetch(`${BASE_URL}/doctors/${docId}`);
  if (!response.ok) throw new Error("Doctor not found");
  return response.json();
};

export const updateDoctor = async (docId, doctorData) => {
  const response = await fetch(`${BASE_URL}/doctor/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doc_id: docId, ...doctorData }),
  });

  return response.json();
};

export const deleteDoctor = async (docId) => {
  const response = await fetch(`${BASE_URL}/doctor/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doc_id: docId }),
  });

  return response.json();
};

export const getAllDoctors = async () => {
  const response = await fetch(`${BASE_URL}/doctors`);
  if (!response.ok) throw new Error("Failed to fetch doctors");
  return response.json();
};
