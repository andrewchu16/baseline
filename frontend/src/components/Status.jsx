import React, { useState, useEffect } from "react";
import axios from "axios";

function FatigueStatus() {
    const [dc, setDc] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [fatigue, setFatigue] = useState(false);

    const fetchThreshold = async () => {
        try {
            const response = await axios.get("/fatigue_status");
            setThreshold(response.data.threshold);
            setDc(response.data.dc);
            setFatigue(response.data.fatigue);
        } catch (err) {
            console.error("Error fetching threshold:", err);
        }
    };

    useEffect(() => {
        fetchThreshold();
    }, []);

    return (
        <div>
            <h2>Fatigue Status</h2>
            <p>Threshold: {threshold}</p>
            <p>DC: {dc}</p>
            <p>Fatigue: {fatigue ? "Yes" : "No"}</p>
        </div>
    )
}

function Status() {
  const [initialized, setInitialized] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/status");
      setInitialized(response.data.initialized);
      setProcessed(response.data.processed);
      setError(null);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch EEG status.");
      console.error("Error fetching status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="bg-sky-200 rounded-lg p-2">
      <h1>My Status</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Initialized: {initialized ? "Yes" : "No"}</p>
          <p>Processed: {processed ? "Yes" : "No"}</p>
        </>
      )}
      {(initialized && processed) ?? <FatigueStatus />}
    </div>
  );
}

export default Status;
