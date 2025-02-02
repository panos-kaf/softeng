import React from "react";
import axios from "axios";

const Home = () => {
  const role = localStorage.getItem("role"); // Παίρνουμε το role από το Local Storage
  const roleLabel = role === "admin" ? "Διαχειριστή" : "Χειριστή"; // Μετατροπή ρόλου σε ελληνικό κείμενο

  // Healthcheck API Request
  const handleHealthCheck = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token που αποστέλλεται:", token); // DEBUGGING

      const response = await axios.get("http://localhost:9115/api/admin/healthcheck", {
        headers: { "x-observatory-auth": `Bearer ${token}` }
      });

      console.log("Απάντηση από το API:", response.data);
    } catch (error) {
      console.error("Healthcheck failed:", error);
      alert("❌ Healthcheck Απέτυχε! Το token μπορεί να είναι λανθασμένο ή να έχει λήξει.");
    }
};

  // Button's Alerts

  const handleResetStations = () => {
    console.log("🔄 Reset Stations executed");
    alert("Reset Stations: Τα δεδομένα των σταθμών επαναφέρθηκαν.");
  };

  const handleResetPasses = () => {
    console.log("🔄 Reset Passes executed");
    alert("Reset Passes: Οι διελεύσεις επαναφέρθηκαν.");
  };

  const handleAddPasses = () => {
    console.log("➕ Add Passes executed");
    alert("Add Passes: Προσθήκη νέας διέλευσης.");
  };

  return (
    <div style={styles.container}>
      <h2>Καλώς ήρθατε, {roleLabel}!</h2>

      {/* Εμφάνιση κουμπιών μόνο αν ο χρήστης είναι admin */}
      {role === "admin" && (
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleHealthCheck}>📡 Healthcheck</button>
          <button style={styles.button} onClick={handleResetStations}>🏛 Reset Stations</button>
          <button style={styles.button} onClick={handleResetPasses}>🔄 Reset Passes</button>
          <button style={styles.button} onClick={handleAddPasses}>➕ Add Passes</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Τα φέρνει προς τα αριστερά
    justifyContent: "flex-start", // Τα κρατάει στο πάνω μέρος
    height: "100vh",
    textAlign: "center",
    paddingTop: "100px", // Απόσταση από την κορυφή
    paddingLeft: "500px", // Μετακινεί το περιεχόμενο πιο δεξιά
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "20px",
  },
  button: {
    padding: "15px 25px",
    fontSize: "18px",
    backgroundColor: "#3a506b",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    minWidth: "180px",
    textAlign: "center",
    transition: "background 0.3s ease",
  },
};

export default Home;

