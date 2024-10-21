import React, { useState, useEffect } from "react";
import axios from "axios";

function FatigueStatus() {
  const [dc, setDc] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [fatigue, setFatigue] = useState(false);

  const fetchFatigueStatus = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/fatigue_status");
      setThreshold(response.data.threshold);
      setDc(response.data.dc);
      setFatigue(response.data.fatigue);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching fatigue status:", err);
    }
  };

  useEffect(() => {
    fetchFatigueStatus();
  }, []);

  return (
    <div>
      <h3 className="font-bold text-lg mb-1">Fatigue Level</h3>
      <p>
        <span className="font-bold">Computed Fatigue Threshold: </span>
        {threshold.toPrecision(4)}
      </p>
      <p>
        <span className="font-bold">DC: </span>
        {dc.toPrecision(4)}
      </p>
      <p>
        <span className="font-bold">Fatigue: </span>
        {fatigue ? "High fatigue levels reached. You will be signed off duty shortly." : "Fatigue levels normal. You may continue working."}
      </p>
    </div>
  );
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
    <div className="bg-neutral-100 rounded-lg p-4 drop-shadow-sm">
      <h2 className="font-bold text-xl mb-2">Status and Vitals</h2>
      <h3 className="font-bold text-lg mb-1">Application Status</h3>
      <div className="flex gap-3 flex-wrap mb-3">
        {initialized ? (
          <div className="bg-green-200 px-3 py-2 rounded-2xl text-green-800 font-bold hover:drop-shadow-md transition-shadow hover:cursor-pointer drop-shadow-sm">
            Ready
          </div>
        ) : (
          <div className="bg-red-200 px-3 py-2 rounded-2xl text-red-800 font-bold d hover:drop-shadow-md transition-shadow hover:cursor-pointerrop-shadow-sm">
            Uninitialized
          </div>
        )}
        {processed ? (
          <div className="bg-green-200 px-3 py-2 rounded-2xl text-green-800 font-bold hover:drop-shadow-md transition-shadow hover:cursor-pointer drop-shadow-sm">
            Recording
          </div>
        ) : (
          <div className="bg-neutral-200 px-3 py-2 rounded-2xl text-neutral-800 font-bold d hover:drop-shadow-md transition-shadow hover:cursor-pointerrop-shadow-sm">
            Not Recording
          </div>
        )}
        {!error ? (
          <div className="bg-neutral-200 px-3 py-2 rounded-2xl text-neutral-800 font-bold hover:drop-shadow-md transition-shadow hover:cursor-pointer drop-shadow-sm">
            No Errors
          </div>
        ) : (
          <div className="bg-red-200 px-3 py-2 rounded-2xl text-red-800 font-bold d hover:drop-shadow-md transition-shadow hover:cursor-pointerrop-shadow-sm">
            {"Error (check console)"}
          </div>
        )}
      </div>
      {initialized && processed ? <FatigueStatus /> : ""}
    </div>
  );
}

export default Status;
