Hearth & Co: Smart Rental Platform
Hearth & Co is a full-featured rental platform designed to simplify renting for both tenants and landlords. Built on the MERN stack, it supports short-term and long-term rentals, advanced filtering, roommate matching, in-app payments, and much more—making property discovery seamless and stress-free.

🚀 Features
🏠 Property Management
List & Manage Properties – Upload images/videos, add categories and tags.
Booking System – Real-time availability, calendar-based bookings.

🧑‍🤝‍🧑 Roommate Finding
Survey-Based Search – Find roommates through survey filled by proprty owner.

📍 Interactive Maps
Real-Time Maps – Visualize properties using React Leaflet.

💳 Integrated Payments
Stripe Integration – Secure and seamless rent payments.
Payment Confirmation – Dummy payment flows supported.

📊 Admin Dashboard
Category & users Analytics – Pie and bar charts showing property data.
User & Property Management – Moderate listings.

🔍 Advanced Filtering & UX
Hyper-Specific tag Search – Pet-friendly, accessible, Wi-Fi, and more.
Category-Based Browsing – Click through categories to view specific listings.

🛠️ Tech Stack
Frontend
React.js
Tailwind CSS – Utility-first styling
React Leaflet – Map visualization
React Icons – Icon library

Backend
Node.js + Express
MongoDB + Mongoose – Database & modeling

Stripe – Payment processing
Jest – Unit testing

AI & Features
Chart.js – Visualize data in admin dashboard

🧪 Setup & Installation

# Clone the Repository
git clone https://github.com/Aasma0/Rental_Platform

🔧 Install Dependencies
cd frontend
npm install


cd ../backend
npm install

▶️ Run the Development Servers
Start Frontend

cd frontend
npm start

Start Backend

cd ../backend
npm start

💳 Stripe Payment Setup

STRIPE_SECRET_KEY=sk_test_51R7XyVDIfAK6jlSaYqLTRvN32QqXt4IdZ5qbf1kqZsATA3hdSxtMq5dvc3BHm6NYJkqshRt7wepbSuAYH4dw7Nf700xy2nMimw


🧪 Testing
# Run backend tests using Jest
cd backend
npm test