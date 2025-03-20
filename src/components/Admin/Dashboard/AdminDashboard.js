import React, { useState } from "react";
import NavbarSection from "../../LandingPage/NavBar";
import Sidebar from "../../LandingPage/Sidebar";
import ViewAll from "./ViewAll";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} pageType="admin" />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} pageType="admin" />
      <ViewAll />
    </div>
  );
};

export default AdminDashboard;
