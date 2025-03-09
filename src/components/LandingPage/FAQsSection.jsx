import React from "react";

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
  return (
    <section className="py-16 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">FAQs</h2>
      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-lg font-semibold">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQsSection;
