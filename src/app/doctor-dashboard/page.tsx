"use client"; // Marking this file as a client-side component

import { useState, useRef } from "react";
import Link from "next/link";

export default function DoctorDashboard() {
  const [choice, setChoice] = useState<"upload" | "record" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks: Blob[] = [];

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

  const handleSubmit = () => {
    if (choice === "upload" && selectedFile) {
      console.log("Submitting file:", selectedFile);
      // Add API call for file submission here
    } else if (choice === "record" && recordedBlob) {
      console.log("Submitting recorded video:", recordedBlob);
      // Add API call for recorded video submission here
    } else {
      alert("Please complete the required action before submitting.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="flex flex-col items-center mb-8 p-4 border-b border-teal-800">
          <img
            src="/doc2.jpg" // Replace with dynamic profile picture path
            alt="Doctor Profile"
            className="w-20 h-20 rounded-full mb-4"
          />
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
          <h1 className="text-xl font-bold text-teal-700">
            Doctor Dashboard
          </h1>
          <div>
            
            <a href="#" className="text-teal-700 hover:underline">
              Contact Admin
            </a>
          </div>
        </header>

        <main className="p-6">
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
                      Choose Action
                    </button>
                    <span> / </span>
                  </li>
                  <li className="text-gray-600">
                    {choice === "upload" ? "Upload File" : "Record Video"}
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
        </main>
      </div>
    </div>
  );
}
