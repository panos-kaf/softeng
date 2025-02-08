import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Passes = () => {
  const [selectedStation, setSelectedStation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tollStations, setTollStations] = useState([]);

  useEffect(() => {
    const fetchTollStations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/tollstations`, {
          headers: { "x-observatory-auth": token }
        });

        setTollStations(response.data);
      } catch (error) {
        console.error("❌ Error fetching toll stations:", error);
      }
    };

    fetchTollStations();
  }, []);

  const handleSearch = () => {
    console.log("📡 Σταθμός:", selectedStation);
    console.log("📅 Από:", fromDate);
    console.log("📅 Μέχρι:", toDate);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚗 Διελεύσεις Οχημάτων</h2>
      <div style={styles.filtersWrapper}>
        <div style={styles.filterContainer}>
          <div style={styles.filterItem}>
            <label>Επιλέξτε Σταθμό:</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              style={styles.select}
            >
              <option value="">Όλοι οι σταθμοί</option>
              {tollStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.road} - {station.locality}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.filterItem}>
            <label>Από:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.filterItem}>
            <label>Μέχρι:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        <button onClick={handleSearch} style={styles.button}>
          🔎 Αναζήτηση
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "900px", margin: "auto" },
  title: { textAlign: "left", marginBottom: "20px" },
  filtersWrapper: { display: "flex", flexDirection: "column", alignItems: "center" },
  filterContainer: { display: "flex", justifyContent: "center", gap: "20px", alignItems: "center", flexWrap: "wrap" },
  filterItem: { display: "flex", flexDirection: "column", alignItems: "center" },
  select: { padding: "8px", fontSize: "16px", width: "180px" },
  input: { padding: "8px", fontSize: "16px", width: "150px" },
  button: { marginTop: "20px", padding: "10px 20px", fontSize: "16px", backgroundColor: "#3a506b", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" },
};

export default Passes;
