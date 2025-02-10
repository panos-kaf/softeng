import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Passes = () => {
  const [selectedStation, setSelectedStation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tollStations, setTollStations] = useState([]);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false); // Flag για το αν έχει γίνει αναζήτηση

  useEffect(() => {
    const fetchTollStations = async () => {
      try {
        const token = localStorage.getItem("token");
        const operator_name = localStorage.getItem("operator_name");

        if (!token || !operator_name) {
          console.error("❌ Δεν βρέθηκε token ή operator_name!");
          return;
        }

        const response = await axios.post(
          `${API_URL}/tollstations`,
          { operator_name },
          { headers: { "x-observatory-auth": token } }
        );

        console.log("📋 Σταθμοί που επιστράφηκαν:", response.data);

        setTollStations(response.data);
      } catch (error) {
        console.error("❌ Σφάλμα κατά τη λήψη των σταθμών:", error.response ? error.response.data : error);
      }

    };

    fetchTollStations();
  }, []);

  const handleSearch = async () => {
    console.log("🔍 API Request URL:", `${API_URL}/passanalysis/${selectedStation}/someTagOpID/${fromDate}/${toDate}`);
    console.log("📡 Σταθμός:", selectedStation);

    if (!selectedStation || !fromDate || !toDate) {
      setError("Παρακαλώ επιλέξτε σταθμό και ημερομηνίες!");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true); // Ενεργοποιούμε το flag ότι έγινε αναζήτηση

    // Μετατροπή των ημερομηνιών από YYYY-MM-DD σε YYYYMMDD
    const formattedFromDate = fromDate.replace(/-/g, "");
    const formattedToDate = toDate.replace(/-/g, "");

    console.log("📅 Από:", formattedFromDate);
    console.log("📅 Μέχρι:", formattedToDate);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/tollStationPasses/${selectedStation}/${formattedFromDate}/${formattedToDate}`,
        { headers: { "x-observatory-auth": token } }
      );

      console.log("✅ API Response:", response.data);

      if (response.status === 204) {
        setPasses([]);
      } else {
        setPasses(response.data.passList);
      }
    } catch (err) {
      setError("❌ Σφάλμα φόρτωσης δεδομένων.");
      console.error(err);
    }

    setLoading(false);
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
                <option key={station.id} value={station.toll_id}>
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
      
      {searched && (
        <div style={styles.stationInfo}>
          <p><strong>Σταθμός:</strong> {selectedStation}</p>
  
        </div>
      )}

      {loading && <p>⏳ Φόρτωση...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {searched && ( // Μόνο αν έχει γίνει αναζήτηση θα εμφανίζεται ο πίνακας
        <table border="1" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Tag Provider</th>
              <th>Tag ID</th>
              <th>Ημερομηνία</th>
              <th>Χρέωση</th>
            </tr>
          </thead>
          <tbody>
            {passes.length > 0 ? (
              passes.map((pass) => (
                <tr key={pass.passID}>
                  <td>{pass.tagProvider}</td>
                  <td>{pass.tagID}</td>
                  <td>{new Date(pass.passTimestamp).toLocaleString("el-GR")}</td>
                  <td>{pass.passCharge}€</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Δεν βρέθηκαν δεδομένα</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: { 
    padding: "20px",
    maxWidth: "900px",
    margin: "auto"
  },
  title: { 
    textAlign: "left", 
    marginBottom: "20px" 
  },
  filtersWrapper: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  },
  filterContainer: { 
    display: "flex", 
    justifyContent: "center", 
    gap: "20px", 
    alignItems: "center", 
    flexWrap: "wrap" 
  },
  filterItem: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  },
  select: { 
    padding: "8px", 
    fontSize: "16px", 
    width: "180px" 
  },
  input: { 
    padding: "8px", 
    fontSize: "16px", 
    width: "150px" 
  },
  button: { 
    marginTop: "20px", 
    padding: "10px 20px", 
    fontSize: "16px",
    backgroundColor: "#3a506b", 
    color: "white", 
    border: "none", 
    cursor: "pointer", 
    borderRadius: "5px" 
  },
};

export default Passes;
