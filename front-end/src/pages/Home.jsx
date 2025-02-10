import React from "react";

import DashboardBanner from "../components/DashboardBanner";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Καλώς ήρθατε στο Dashboard</h1>
      <DashboardBanner />
    </div>
  );
};

export default Home;



