import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaRoad } from "react-icons/fa";
import "./DashboardBanner.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const DashboardBanner = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ Δεν υπάρχει token!");
          return;
        }

        const response = await axios.get(`${API_URL}/dashboard`, {
          headers: {"x-observatory-auth": token},
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="cards-container">
        {/* Card για Operators */}
        <div className="card">
          <FaUsers className="card-icon" />
          <div className="card-text">
            <h2 className="card-number">{stats.totalOperators ?? 0}</h2>
            <p className="card-label">Συνολικοί Operators</p>
          </div>
        </div>

        {/* Card για Διόδια */}
        <div className="card green">
          <FaRoad className="card-icon" />
          <div className="card-text">
            <h2 className="card-number">{stats.totalTolls ?? 0}</h2>
            <p className="card-label">Συνολικά Διόδια</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBanner;
