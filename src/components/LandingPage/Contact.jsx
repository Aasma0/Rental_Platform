import React from "react";

const ContactUsSection = () => {
  return (
    <div className="text-center mb-32">
      <h2 className="text-3xl font-bold">Contact Us</h2>
      <form className="mt-4">
        <input type="text" placeholder="Name" className="p-4 mb-4 w-96 border border-neutral-300" />
        <input type="email" placeholder="Email" className="p-4 mb-4 w-96 border border-neutral-300" />
        <textarea placeholder="Message" className="p-4 mb-4 w-96 border border-neutral-300"></textarea>
        <button type="submit" className="bg-blue-700 text-white p-4 w-96 rounded-xl">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUsSection;
