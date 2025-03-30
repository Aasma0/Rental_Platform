// // src/pages/TransactionDetail.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, Link } from 'react-router-dom';

// const TransactionDetail = () => {
//   const { id } = useParams();
//   const [transaction, setTransaction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTransaction = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`http://localhost:8000/api/booking/transaction/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setTransaction(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch transaction details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransaction();
//   }, [id]);

//   if (loading) return <div className="text-center py-8">Loading transaction details...</div>;
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
//   if (!transaction) return <div className="text-center py-8">Transaction not found</div>;

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-4xl">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Transaction Details</h1>
//         <Link to="/transactions" className="text-blue-600 hover:text-blue-800">
//           ← Back to Transactions
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">{transaction.property?.title || 'N/A'}</h2>
//           <p className="text-sm text-gray-500">Transaction ID: {transaction._id}</p>
//         </div>

//         <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Booking Dates</h3>
//             <p className="mt-1 text-sm text-gray-900">
//               {new Date(transaction.startDate).toLocaleDateString()} - {new Date(transaction.endDate).toLocaleDateString()}
//             </p>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
//             <p className="mt-1 text-sm text-gray-900">
//               {new Date(transaction.createdAt).toLocaleString()}
//             </p>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
//             <p className="mt-1">
//               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                 ${transaction.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
//                    transaction.paymentStatus === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' : 
//                    'bg-red-100 text-red-800'}`}>
//                 {transaction.paymentStatus}
//               </span>
//             </p>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
//             <p className="mt-1 text-sm text-gray-900">
//               {transaction.paymentType === 'pay_full' ? 'Full Payment' : 
//                transaction.paymentType === 'pay_deposit' ? 'Deposit' : 
//                'Pay Later'}
//             </p>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
//             <p className="mt-1 text-sm text-gray-900">
//               ${transaction.totalPrice}
//             </p>
//           </div>

//           <div>
//             <h3 className="text-sm font-medium text-gray-500">Payment ID</h3>
//             <p className="mt-1 text-sm text-gray-900">
//               {transaction.paymentIntentId || 'N/A'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionDetail;