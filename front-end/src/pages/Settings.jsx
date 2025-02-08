import React, { useState } from "react";
import axios from "axios"; 

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const ADMIN_URL = `${API_URL}/admin`;

const Settings = () => {
  const [healthStatus, setHealthStatus] = useState(null); 
  const [resetStatus, setResetStatus] = useState(null); 
  const [showDetails, setShowDetails] = useState(false); 
  const [resetPasses, setResetPassesStatus] = useState(null);
  const [addPasses, setAddPassesStatus] = useState(null);

  /** 📡 Healthcheck */
  const handleHealthcheck = async () => {
    try {
      console.log("📡 Healthcheck request ξεκίνησε...");
      
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("No token found in localStorage!");
        setHealthStatus({ message: "Δεν βρέθηκε token!", error: true });
        return;
      }

      console.log("📡 Στέλνουμε request στο API...");
      const response = await axios.get(`${ADMIN_URL}/healthcheck`, {
        headers: { "x-observatory-auth": token }, 
      });

      console.log("✅ Healthcheck επιτυχές:", response.data);
      setHealthStatus({
        message: "✅ Σύνδεση με τον server επιτυχής!",
        data: response.data,
        error: false,
      });

    } catch (error) {
      console.error("❌ Healthcheck request απέτυχε:", error);
      setHealthStatus({
        message: `❌ Σφάλμα: ${error.response?.data?.message || "Αποτυχία σύνδεσης"}`,
        error: true,
      });
    }
  };

  /** 🛠 Reset Stations */
  const handleResetStations = async () => {
    try {
      console.log("🛠 Reset Stations request ξεκίνησε...");

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found in localStorage!");
        setResetStatus({ message: "❌ Δεν βρέθηκε token!", error: true });
        return;
      }

      console.log("🛠 Στέλνουμε request στο API...");
      const response = await axios.post(`${ADMIN_URL}/resetstations`, {}, {
        headers: { "x-observatory-auth": token },
      });

      console.log("✅ Reset Stations επιτυχές:", response.data);
      setResetStatus({
        message: "✅ Επαναφορά σταθμών διοδίων ολοκληρώθηκε!",
        data: response.data,
        error: false,
      });

    } catch (error) {
      console.error("❌ Reset Stations request απέτυχε:", error);
      setResetStatus({
        message: `❌ Σφάλμα: ${error.response?.data?.message || "Αποτυχία σύνδεσης"}`,
        error: true,
      });
    }
  };

/** 🛠 Reset Passes */
const handleResetPasses = async () => {
  try {
    console.log("🛠 Reset Passes request ξεκίνησε...");

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found in localStorage!");
      setResetPassesStatus({ message: "❌ Δεν βρέθηκε token!", error: true });
      return;
    }

    console.log("🛠 Στέλνουμε request στο API...");
    const response = await axios.post(`${ADMIN_URL}/resetpasses`, {}, {
      headers: { "x-observatory-auth": token },
    });

    console.log("✅ Reset Passes επιτυχές:", response.data);
    setResetPassesStatus({
      message: "✅ Επαναφορά των διελεύσεων ολοκληρώθηκε!",
      data: response.data,
      error: false,
    });

  } catch (error) {
    console.error("❌ Reset Passes request απέτυχε:", error);
    setResetPassesStatus({
      message: `❌ Σφάλμα: ${error.response?.data?.message || "Αποτυχία σύνδεσης"}`,
      error: true,
    });
  }
};

/** 🛠 Add Passes  */
const handleAddPasses = async () => {
  try {
    console.log("🛠 Add Passes request ξεκίνησε...");

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found in localStorage!");
      setAddPassesStatus({ message: "❌ Δεν βρέθηκε token!", error: true });
      return;
    }

    console.log("🛠 Στέλνουμε request στο API...");
    const response = await axios.post(`${ADMIN_URL}/addpasses`, {}, {
      headers: { "x-observatory-auth": token },
    });

    console.log("✅ Reset Passes επιτυχές:", response.data);
    setAddPassesStatus({
      message: "✅ Η προσθήκη των διελεύσεων ολοκληρώθηκε!",
      data: response.data,
      error: false,
    });

  } catch (error) {
    console.error("❌ Add Passes request απέτυχε:", error);
    setAddPassesStatus({
      message: `❌ Σφάλμα: ${error.response?.data?.message || "Αποτυχία σύνδεσης"}`,
      error: true,
    });
  }
};

  return (
    <div style={styles.container}>
      <h2>Διαχείριση</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleHealthcheck}>
          📡 Healthcheck
        </button>
        <button style={styles.button} onClick={handleResetStations}>
          🛠️ Reset Stations
        </button>
        <button style={styles.button} onClick={handleResetPasses}>
          🔄 Reset Passes
        </button>
        <button style={styles.button} onClick={handleAddPasses}>
          ➕ Add Passes
        </button>
      </div>

      {/* Εμφάνιση Μηνυμάτων Healthcheck */}
      {healthStatus && (
        <div style={healthStatus.error ? styles.errorMessage : styles.successMessage}>
          {healthStatus.message}
          {!healthStatus.error && healthStatus.data && (
            <>
              <button 
                style={styles.moreButton} 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "⬆ Απόκρυψη" : "Περισσότερα"}
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

      {/* Εμφάνιση Μηνυμάτων Reset Stations */}
      {resetStatus && (
        <div style={resetStatus.error ? styles.errorMessage : styles.successMessage}>
          {resetStatus.message}
        </div>
      )}
      {/* Εμφάνιση Μηνυμάτων Reset Passes */}
      {resetPasses && (
        <div style={resetPasses.error ? styles.errorMessage : styles.successMessage}>
          {resetPasses.message}
        </div>
      )}
      {/* Εμφάνιση Μηνυμάτων Add Passes */}
      {addPasses && (
        <div style={addPasses.error ? styles.errorMessage : styles.successMessage}>
          {addPasses.message}
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
    height: "50vh",
    width: "50vw",
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
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "12px",
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
