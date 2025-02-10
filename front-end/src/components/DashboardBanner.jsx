import { useEffect, useState } from "react";
import axios from "axios";

const DashboardBanner = () => {
  const [stats, setStats] = useState({ totalOperators: 0, totalTolls: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:9115/api/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-blue-500 text-white rounded-2xl shadow-lg flex justify-between items-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{stats.totalOperators}</h2>
        <p className="text-lg">Συνολικοί Operators</p>
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold">{stats.totalTolls}</h2>
        <p className="text-lg">Συνολικά Διόδια</p>
      </div>
    </div>
  );
};

export default DashboardBanner;
