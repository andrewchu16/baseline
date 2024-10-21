import { Helmet } from "react-helmet";
import axios from "axios";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

function UploadBaseline() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    const element = document.getElementById('current');
    
    // Add class when component mounts
    if (element) {
      element.classList.add('active');
    }

    // Cleanup: Remove class when component unmounts
    return () => {
      if (element) {
        element.classList.remove('active');
      }
    };
  }, []); 


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("File uploaded successfully: " + response.data.status);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-neutral-200">
      <Helmet>
        <title>Baseline | Record Activity</title>
      </Helmet>
      <aside className="h-screen w-52 p-4 pr-2">
        <Navbar />
      </aside>
      <main className="h-screen flex-grow pl-2 p-4">
        <div className="drop-shadow-sm bg-neutral-100 rounded-lg p-4 h-full w-full flex flex-col">
          <h2 className="font-bold text-xl mb-2">Record Activity</h2>
          <div className="w-full flex-grow flex items-center justify-center flex-col gap-5">
            <label className="bg-neutral-200 rounded-lg w-80 h-60 drop-shadow-md hover:drop-shadow-xl transition-shadow flex flex-col items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-12 h-12 fill-neutral-600 mb-4"
              >
                <path d="M11 14.825V18q0 .425.288.713T12 19t.713-.288T13 18v-3.175l.9.9q.15.15.338.225t.375.063t.362-.088t.325-.225q.275-.3.288-.7t-.288-.7l-2.6-2.6q-.15-.15-.325-.212T12 11.425t-.375.063t-.325.212l-2.6 2.6q-.3.3-.287.7t.312.7q.3.275.7.288t.7-.288zM6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.587 1.413T18 22zm7-14V4H6v16h12V9h-4q-.425 0-.712-.288T13 8M6 4v5zv16z" />
              </svg>
              <p>
                {file ? (
                  <span className="font-bold">{file.name}</span>
                ) : (
                  <>
                    <span className="font-bold">Click to upload </span>
                    an EDF or FIF file.
                  </>
                )}
              </p>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".edf, .fif"
              />
            </label>
            <button
              className="hover:text-neutral-600 text-neutral-800 transition-colors hover:font-bold text-xl rounded-lg drop-shadow-md"
              onClick={handleFileUpload}
            >
              Record
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UploadBaseline;
