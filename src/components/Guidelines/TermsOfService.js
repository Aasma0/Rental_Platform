import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white text-center py-12">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2">Effective Date: March 2025</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg mt-6 rounded-lg">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p className="text-gray-700 mt-2">
          By accessing and using our website, you agree to our Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. User Responsibilities</h2>
        <p className="text-gray-700 mt-2">
          Users must provide accurate information and comply with applicable laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6">3. Termination</h2>
        <p className="text-gray-700 mt-2">
          We reserve the right to terminate accounts if violations occur.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Contact</h2>
        <p className="text-gray-700 mt-2">Email: support@hearthco.com</p>
      </div>
    </div>
  );
};

export default TermsOfService;
