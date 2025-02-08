import React, { useState } from "react";

const Passes = () => {
  // State για τον σταθμό διοδίων
  const [selectedStation, setSelectedStation] = useState("");

  // State για τις ημερομηνίες
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Προσωρινά δεδομένα σταθμών διοδίων (Αργότερα θα τα φέρουμε από το backend)
  const tollStations = [
    { id: 1, name: "Σταθμός Α" },
    { id: 2, name: "Σταθμός Β" },
    { id: 3, name: "Σταθμός Γ" }
  ];

  const handleSearch = () => {
    console.log("📡 Σταθμός:", selectedStation);
    console.log("📅 Από:", fromDate);
    console.log("📅 Μέχρι:", toDate);
  };

  return (
    <div style={styles.container}>
      {/* Τίτλος (Αριστερά) */}
      <h2 style={styles.title}>🚗 Διελεύσεις Οχημάτων</h2>

      {/* Κεντραρισμένο container για τα φίλτρα */}
      <div style={styles.filtersWrapper}>
        <div style={styles.filterContainer}>
          {/* Επιλογή Σταθμού Διοδίων */}
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
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {/* Επιλογή Ημερομηνιών */}
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

        {/* Κουμπί Αναζήτησης */}
        <button onClick={handleSearch} style={styles.button}>
          🔎 Αναζήτηση
        </button>
      </div>
    </div>
  );
};

// Στυλ για τη σελίδα
const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    textAlign: "left", 
    marginBottom: "20px",
  },
  filtersWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Κεντράρει το filter container
  },
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
    width: "180px",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    width: "150px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#3a506b",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Passes;
