import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/booking/my-transactions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 inline-block"></div>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{transaction.property?.title || 'Property'}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-bold text-gray-800">Rs {transaction.totalPrice}</span>
              </div>
              <div className="mt-2 text-sm">
                <p>Status: <span className={`${transaction.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {transaction.paymentStatus}
                </span></p>
                <p className="text-gray-600">Payment ID: {transaction.paymentIntentId?.slice(-8) || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;