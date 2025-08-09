import React from "react";
import { Outlet } from "react-router-dom";
import "@/css/PublicLayout.scss"; // Assuming you have a CSS file for styling

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <div className="public-layout-content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
