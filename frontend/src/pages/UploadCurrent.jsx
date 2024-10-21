import { Helmet } from "react-helmet";
import axios from "axios";
import { useState } from "react";
import Navbar from "../components/Navbar";

function UploadBaseline() {
  const [file, setFile] = useState(null);

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
    <div className="h-screen w-screen flex">
      <Helmet>
        <title>Baseline | Record Activity</title>
      </Helmet>
      <aside className="h-screen w-52 p-3">
        <Navbar />
      </aside>
      <main className="h-screen flex-grow p-3">
        <h1>Record Activity</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
      </main>
    </div>
  );
}

export default UploadBaseline;
