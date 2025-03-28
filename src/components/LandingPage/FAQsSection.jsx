import React, { useState } from "react";

const faqs = [
  {
    question: "What is this platform?",
    answer: "Our platform connects you with the best property listings.",
  },
  {
    question: "How do I list my property?",
    answer: "You can easily list your property by signing up and following a few steps.",
  },
  {
    question: "Are transactions secure?",
    answer: "Yes, we use top-notch security measures to ensure safety.",
  },
];

const FAQsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-12">FAQs</h2>
      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border rounded-lg bg-white shadow-md">
            <button
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center focus:outline-none"
            >
              {faq.question}
              <span className="text-gray-500">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQsSection;
