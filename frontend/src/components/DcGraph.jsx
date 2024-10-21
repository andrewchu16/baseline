import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

function DcGraph() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(0);

  const fetchThreshold = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/threshold");

      setThreshold(response.data.threshold);
    } catch (err) {
      setError("Failed to fetch EEG status.");
      console.error("Error fetching status:", err);
    }
  };

  const fetchDcs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/status");

      if (!response.data.initialized) {
        setError("Baseline not initialized.");
        return;
      }

      if (!response.data.processed) {
        setError("No brain activity recorded.");
        return;
      }
    } catch (err) {
      setError("Failed to fetch EEG status.");
      console.error("Error fetching status:", err);
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/dcs");
      const d = response.data.dcs;

      const chartData = d.map((value, index) => ({
        name: String(index),
        dc: value,
      }));
      setData(chartData);
      console.log(d);
      setError(null);
    } catch (err) {
      setError("Failed to fetch EEG alpha rhythms.");
      console.error("Error fetching status:", err);
    }
  };

  useEffect(() => {
    fetchDcs();
    fetchThreshold();
  }, []);

  return (
    <div className="bg-neutral-100 rounded-lg p-2 drop-shadow-sm">
      <h2>Combined Deviation</h2>
      <BarChart width={730} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={false} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="dc" fill="#8884d8" barSize={"10%"}/>
        <ReferenceLine y={threshold} stroke="red" />
      </BarChart>
    </div>
  );
}

export default DcGraph;
