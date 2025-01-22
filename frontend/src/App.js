import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import WaveLoading from './waveLoading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("6m");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setChartData(null);
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        symbol: stockSymbol,
        timeframe: timeframe
      });
      
      const { dates, historical, predictionDates, actualValues, predictedValues } = response.data;
      
      setChartData({
        labels: [...dates, ...predictionDates],
        datasets: [
          {
            label: "Historical Prices",
            data: historical,
            borderColor: "#ffffff",
            backgroundColor: "#ffffff",
            fill: false,
            tension: 0.4,
            pointStyle: 'rect',
            pointRadius: 4,
          },
          {
            label: "Actual Prices",
            data: [...Array(dates.length).fill(null), ...actualValues],
            borderColor: "#ffffff",
            backgroundColor: "#ffffff",
            fill: false,
            tension: 0.4,
            pointStyle: 'rect',
            pointRadius: 4,
          },
          {
            label: "Predicted Prices",
            data: [...Array(dates.length).fill(null), ...predictedValues],
            borderColor: "#a855f7",
            backgroundColor: "#a855f7",
            fill: false,
            borderDash: [5, 5],
            tension: 0.4,
            pointStyle: 'rect',
            pointRadius: 4,
          },
        ],
      });
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-2">PHI</h1>
          <h2 className="text-2xl font-semibold mb-4">STOCK PREDICTOR</h2>
          <p className="text-gray-500 text-sm">
            This application is for demonstration purposes only and should not be used for actual stock trading decisions.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter Stock Symbol (e.g., AAPL)"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-purple-500"
          />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="6m">6 Months</option>
            <option value="3m">3 Months</option>
            <option value="1m">1 Month</option>
            <option value="1w">1 Week</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Predict
          </button>
        </form>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        
        {/* Loading Animation or Chart Section */}
        {isLoading ? (
          <WaveLoading />
        ) : (
          chartData && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "white",
                        usePointStyle: true,
                        pointStyle: 'rect',
                      }
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "white",
                      }
                    },
                    y: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "white",
                      }
                    }
                  }
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;