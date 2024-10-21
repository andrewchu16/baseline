import { Helmet } from "react-helmet";
import axios from "axios";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

function UploadBaseline() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    const element = document.getElementById('baseline');
    
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
        "http://127.0.0.1:8000/set_baseline",
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
    <div className="h-screen w-screen flex">
      <Helmet>
        <title>Baseline | Record Baseline</title>
      </Helmet>
      <aside className="h-screen w-52 p-3">
        <Navbar />
      </aside>
      <main className="h-screen flex-grow gap-2 p-3">
        <h1>Record Baseline</h1>
        <input type="file" onChange={handleFileChange} accept=".edf, .fif" />
        <button onClick={handleFileUpload}>Upload</button>
      </main>
    </div>
  );
}

export default UploadBaseline;
