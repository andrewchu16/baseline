import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function ThetaRhythmGraph() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchAlphaRhythms = async () => {
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
      const response = await axios.get("http://127.0.0.1:8000/theta_rhythms");
      const d = response.data.theta_rhythms[0].slice(
        0,
        Math.min(10000, response.data.theta_rhythms[0].length)
      );

      const chartData = d.map((value, index) => ({
        name: String(index),
        theta: value,
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
    fetchAlphaRhythms();
  }, []);

  return (
    <div className="bg-neutral-100 rounded-lg p-4 overflow-clip drop-shadow-sm flex flex-col">
      <h2 className="font-bold text-xl mb-2">Theta Rhythm</h2>
      {error ? <p>{error}</p> : null}
      {data ? (
        <div className="w-full flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                bottom: 5,
                left: 5,
                right: 5,
              }}
            >
              <XAxis dataKey="name" tick={false} />
              <YAxis
                tickFormatter={(value) => value.toExponential(2)}
                tick={false}
                width={1}
              />
              <Tooltip />
              <ReferenceLine y={0} stroke="#000" />
              <Line
                type="monotone"
                dataKey="theta"
                stroke="#8884d8"
                dot={false}
                animationDuration={2000}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No data to show.</p>
      )}
    </div>
  );
}

export default ThetaRhythmGraph;
