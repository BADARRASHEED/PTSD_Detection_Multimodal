"use client";

import { useState, useRef, useEffect } from "react";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const MAX_VIDEO_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function DoctorDashboard() {
  const [choice, setChoice] = useState<"upload" | "record" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- Handle File Upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds the 500MB limit.");
        return;
      }
      if (!file.type.startsWith("video/")) {
        alert("Invalid file type. Please upload a valid video file.");
        return;
      }
      setSelectedFile(file);
      setPrediction(null);
    }
  };

  // --- Handle Recording ---
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      chunks.current = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        setRecordedBlob(blob);
        setPrediction(null);
        if (videoRef.current?.srcObject instanceof MediaStream) {
          videoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Stop recording after 10 minutes
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          alert("Video recording time exceeded the 10 minutes limit.");
        }
      }, MAX_VIDEO_DURATION);
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  const stopRecording = (reset: boolean = false) => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (reset) {
      setRecordedBlob(null);
    }
    if (videoRef.current?.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleStopRecording = () => stopRecording();
  const handleCancelRecording = () => stopRecording(true);

  // --- API Submission ---
  const handleSubmit = async () => {
    let fileToSend: File | Blob | null = null;
    if (choice === "upload" && selectedFile) {
      fileToSend = selectedFile;
    } else if (choice === "record" && recordedBlob) {
      fileToSend = recordedBlob;
    } else {
      alert("Please complete the required action before submitting.");
      return;
    }

    setLoading(true);
    setPrediction(null);

    const formData = new FormData();
    formData.append("video", fileToSend, "input_video.mp4");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Prediction failed.");
      }
      const data = await response.json();
      setPrediction(data.prediction || "No Result");
    } catch (error) {
      alert("Prediction failed. Please try again.");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Logout Modal Logic ---
  const handleOpenLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = (confirm: boolean) => {
    if (confirm) handleLogout();
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  // --- Cleanup Recording on Unmount ---
  useEffect(() => {
    return () => stopRecording();
    // eslint-disable-next-line
  }, []);

  // --- Render ---
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col">
        <div className="flex flex-col items-center mb-8 p-4 border-b border-teal-800">
          <h2 className="text-xl font-bold">Dr. John Doe</h2>
          <p className="text-sm">Psychologist</p>
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
        <button
          onClick={handleOpenLogoutModal}
          className="mt-auto text-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 m-4"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
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
                      Dashboard
                    </button>
                    <span> / </span>
                  </li>
                  <li className="text-gray-600">
                    {choice === "upload"
                      ? "Upload File"
                      : choice === "record"
                      ? "Record Video"
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
              <h2 className="text-xl font-semibold mb-4">
                Upload Recorded File
              </h2>
              <input
                type="file"
                accept="video/mp4,video/webm,video/mov,video/avi"
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
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze PTSD"}
              </button>
              {prediction && (
                <p className="text-green-700 font-semibold mt-2">
                  Prediction: <span className="uppercase">{prediction}</span>
                </p>
              )}
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
                {recordedBlob && (
                  <button
                    onClick={handleCancelRecording}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
                  >
                    Cancel Recording
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
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Analyze PTSD"}
                  </button>
                  {prediction && (
                    <p className="text-green-700 font-semibold mt-2">
                      Prediction:{" "}
                      <span className="uppercase">{prediction}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
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
