"use client"; // Marking this file as a client-side component

import { useState, useRef } from "react";
import Link from "next/link";

export default function DoctorDashboard() {
  const [choice, setChoice] = useState<"upload" | "record" | "contact" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks: Blob[] = [];

  const [contactForm, setContactForm] = useState({
    email: "",
    message: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        if (videoRef.current?.srcObject instanceof MediaStream) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (choice === "upload" && selectedFile) {
      console.log("Submitting file:", selectedFile);
      // Add API call for file submission here
    } else if (choice === "record" && recordedBlob) {
      console.log("Submitting recorded video:", recordedBlob);
      // Add API call for recorded video submission here
    } else if (choice === "contact") {
      console.log("Contact form submitted:", contactForm);
      // Add API call for contact form submission here
    } else {
      alert("Please complete the required action before submitting.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="flex flex-col items-center mb-8 p-4 border-b border-teal-800">
          <h2 className="text-xl font-bold">Dr. John Doe</h2>
          <p className="text-sm">Physiologist</p>
        </div>
        <ul className="flex flex-col gap-2 px-4">
          <li>
            <button
              onClick={() => setChoice(null)}
              className={`block w-full text-left py-2 px-4 rounded ${
                choice === null ? "bg-teal-800" : "hover:bg-teal-800"
              }`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setChoice("contact")}
              className={`block w-full text-left py-2 px-4 rounded ${
                choice === "contact" ? "bg-teal-800" : "hover:bg-teal-800"
              }`}
            >
              Contact Admin
            </button>
          </li>
        </ul>
        <Link
          href="/login"
          className="mt-auto text-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 m-4"
        >
          Logout
        </Link>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        

        <main className="p-6">
          {/* Breadcrumbs */}
          {/* Breadcrumbs */}
{choice !== null && (
  <div className="mb-6">
    <nav className="text-sm">
      <ul className="flex gap-2">
        <li>
          <button
            onClick={() => setChoice(null)}
            className="text-teal-700 hover:underline"
          >
            Dashboard
          </button>
          <span> / </span>
        </li>
        <li className="text-gray-600">
          {choice === "upload"
            ? "Upload File"
            : choice === "record"
            ? "Record Video"
            : choice === "contact"
            ? "Contact Admin"
            : ""}
        </li>
      </ul>
    </nav>
  </div>
)}


          {/* Choice Section */}
          {choice === null && (
            <div className="bg-white p-6 rounded shadow-md mb-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Choose an Action</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setChoice("upload")}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                >
                  Upload Recorded File
                </button>
                <button
                  onClick={() => setChoice("record")}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                >
                  Record Live Video
                </button>
              </div>
            </div>
          )}

          {/* Upload Section */}
          {choice === "upload" && (
            <div className="bg-white p-6 rounded shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Upload Recorded File</h2>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="mb-4"
              />
              {selectedFile && (
                <p className="text-gray-700 mb-4">
                  Selected file: <strong>{selectedFile.name}</strong>
                </p>
              )}
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
              >
                Submit File
              </button>
            </div>
          )}

          {/* Recording Section */}
          {choice === "record" && (
            <div className="bg-white p-6 rounded shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Live Recording</h2>
              <video
                ref={videoRef}
                autoPlay
                className="w-full bg-black rounded mb-4"
                style={{ height: "300px" }}
              ></video>
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                  >
                    Stop Recording
                  </button>
                )}
              </div>
              {recordedBlob && (
                <div className="mt-4 text-center">
                  <p className="text-gray-700 mb-4">
                    Recording ready for submission.
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                  >
                    Submit Recording
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Contact Admin Section */}
          {choice === "contact" && (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Contact Admin
      </h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={contactForm.email}
            onChange={handleContactChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 font-medium mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={contactForm.message}
            onChange={handleContactChange}
            rows={4}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          ></textarea>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
}
