import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const Graph = ({ data, onRefresh }) => {
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">{`Users Created: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`${(payload[0].value / totalUsers * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">User Growth By Month</h2>
          <p className="text-sm text-gray-500">Total Users: {totalUsers}</p>
        </div>
        <button 
          onClick={onRefresh} 
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="py-4">
        {totalUsers === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No user data available
          </div>
        ) : (
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="users" name="Users Created" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Monthly Registration Data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users Created
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900">{item.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900 text-right">{item.users}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-900 text-right">
                    {totalUsers > 0 ? `${(item.users / totalUsers * 100).toFixed(1)}%` : '0%'}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50">
                <td className="py-2 px-4 border-b border-gray-200 text-sm font-medium">Total</td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm font-medium text-right">{totalUsers}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm font-medium text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Graph;