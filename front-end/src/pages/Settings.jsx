import React, { useState } from "react";
import axios from "axios"; 

const Settings = () => {
  const [healthStatus, setHealthStatus] = useState(null); 
  const [showDetails, setShowDetails] = useState(false); 

  const handleHealthcheck = async () => {
    try {
      console.log("📡 Healthcheck request ξεκίνησε...");
      
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("No token found in localStorage!");
        setHealthStatus({ message: " Δεν βρέθηκε token!", error: true });
        return;
      }

      console.log("📡 Στέλνουμε request στο API...");
      const response = await axios.get("http://localhost:9115/admin/healthcheck", {
        headers: { "x-observatory-auth": token }, 
      });

      console.log("Healthcheck επιτυχές:", response.data);
      setHealthStatus({
        message: "Σύνδεση με τον server επιτυχής!",
        data: response.data,
        error: false,
      });

    } catch (error) {
      console.error("Healthcheck request απέτυχε:", error);
      setHealthStatus({
        message: ` Σφάλμα: ${error.response?.data?.message || "Αποτυχία σύνδεσης"}`,
        error: true,
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2>Ρυθμίσεις</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleHealthcheck}>
          📡 Healthcheck
        </button>
        <button style={styles.button}>🛠️ Reset Stations</button>
        <button style={styles.button}>🔄 Reset Passes</button>
        <button style={styles.button}>➕ Add Passes</button>
      </div>

      {/* Εμφάνιση μηνύματος */}
      {healthStatus && (
        <div style={healthStatus.error ? styles.errorMessage : styles.successMessage}>
          {healthStatus.message}

          {/* Κουμπί Περισσότερα (Εμφάνιση/Απόκρυψη λεπτομερειών) */}
          {!healthStatus.error && healthStatus.data && (
            <>
              <button 
                style={styles.moreButton} 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "⬆ Απόκρυψη" : "🔍 Περισσότερα"}
              </button>

              {showDetails && (
                <pre style={styles.resultBox}>
                  {JSON.stringify(healthStatus.data, null, 2)}
                </pre>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100vh",
    width: "100vw",
    padding: "20px",
  },
  
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
    marginTop: "20px",
  },
  
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#3a506b",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },

  successMessage: {
    marginTop: "50px",
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "5px",
    border: "1px solid #c3e6cb",
    position: "relative",
  },

  errorMessage: {
    marginTop: "50px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "5px",
    border: "1px solid #f5c6cb",
  },

  moreButton: {
    marginTop: "0px", 
    marginLeft: "20px", 
    padding: "5px 15px", 
    backgroundColor: "#28a745", 
    color: "white",
    border: "2px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  
  resultBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#282c34",
    color: "white",
    borderRadius: "5px",
    overflowX: "auto",
  },
};


export default Settings;