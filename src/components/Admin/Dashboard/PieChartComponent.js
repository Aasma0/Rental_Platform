import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyCounts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/property/count-by-category");
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map((item, index) => ({
            name: item.categoryName || item.category || "Unknown",
            value: item.count || 0,
            fill: COLORS[index % COLORS.length],
          }));
          setCategoryData(formatted);
        } else {
          setCategoryData([{ name: "No Data", value: 1, fill: "#cccccc" }]);
        }
      } catch (err) {
        setError(`Failed to load category data: ${err.message}`);
        setCategoryData([{ name: "Error", value: 1, fill: "#ff0000" }]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPropertyCounts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">Loading category data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;