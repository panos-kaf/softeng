import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Payments = () => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [debt, setDebt] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Παίρνουμε το όνομα του operator που έχει κάνει login
  const loggedInOperator = localStorage.getItem("operator_name");
  const loggedInOperator_id = localStorage.getItem("operator_id");

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error(" Δεν υπάρχει token!");
          return;
        }

        const response = await axios.get(`${API_URL}/operators`, {
          headers: { "x-observatory-auth": token },
        });

        // Φιλτράρουμε τη λίστα για να μην εμφανίζεται ο συνδεδεμένος operator
        const filteredOperators = response.data.filter(
          (operator) => operator.name !== loggedInOperator
        );

        setOperators(filteredOperators);
      } catch (error) {
        console.error(" Σφάλμα φόρτωσης operators:", error.response ? error.response.data : error);
      }
    };

    fetchOperators();
  }, [loggedInOperator]);

  const handleSearch = async () => {
    if (!selectedOperator || !selectedMonth) {
      setError("Παρακαλώ επιλέξτε operator και μήνα!");
      return;
    }
  
    setLoading(true);
    setError("");
    setPaymentSuccess(false);
  
    const token = localStorage.getItem("token");
  
    // Μετατροπή του μήνα σε YYYYMM
    const monthYear = selectedMonth.replace(/-/g, "");
  
    console.log("📡 Αναζήτηση χρέους προς operator:", selectedOperator);
    console.log("📆 Περίοδος πληρωμής:", monthYear);
  
    try {

      console.log(localStorage);

      const response = await axios.get(`${API_URL}/getSettlement/${loggedInOperator_id}/${selectedOperator}/${monthYear}`, {
        headers: { "x-observatory-auth": token },
      });
      
      // elegxos
      console.log("Απόκριση API", response.data);
      
      

      const formattedDebt = response.data.reduce((acc, entry) => {
        acc[entry.id] = parseFloat(entry.amount); // Μετατροπή σε αριθμό
        return acc;
      }, {});
      
      console.log("📊 Μετασχηματισμένο Debt:", formattedDebt);
      setDebt(formattedDebt);
      console.log('debt:',debt);
      

    } catch (err) {
      console.error(" Σφάλμα φόρτωσης χρέους:", err.response ? err.response.data : err);
      setError(" Σφάλμα φόρτωσης χρέους.");
    }
  
    setLoading(false);
  };
  
  

  const handlePayment = async (settlementID) => {
    setLoading(true);
    setError("");
    setPaymentSuccess(false); // Καθαρίζουμε το μήνυμα επιτυχίας πριν την πληρωμή
  
    const token = localStorage.getItem("token");
  
    if (!settlementID) {
      setError("❌ Δεν υπάρχει διαθέσιμο Settlement ID για πληρωμή.");
      setLoading(false);
      return;
    }
  
    try {
      console.log(`💰 Πληρωμή για Settlement ID: ${settlementID}`);
  
      const response = await axios.post(
        `${API_URL}/makePayment`,
        { settlementID }, // Στέλνουμε το `settlementID` στο API
        {
          headers: { "x-observatory-auth": token },
        }
      );
  
      if (response.data.status === "OK") {
        console.log("✅ Επιτυχής πληρωμή!");
        setPaymentSuccess(true);
        setDebt((prevDebt) => {
          const updatedDebt = { ...prevDebt };
          delete updatedDebt[settlementID]; // Αφαιρούμε το πληρωμένο χρέος από το UI
          return updatedDebt;
        });
      } else {
        console.error("❌ Η πληρωμή απέτυχε.");
        setError("❌ Η πληρωμή απέτυχε.");
      }
    } catch (err) {
      console.error("❌ Σφάλμα κατά την πληρωμή:", err.response ? err.response.data : err);
      setError("❌ Η πληρωμή απέτυχε.");
    }
  
    setLoading(false);
  };
  
  
  const settlementEntry = Object.entries(debt).find(([id, amount]) => amount < 0);
  const settlementID = settlementEntry ? settlementEntry[0] : null;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💳 Πληρωμές</h2>

      <div style={styles.filtersWrapper}>
        <div style={styles.filterContainer}>
          <div style={styles.filterItem}>
            <label>Επιλέξτε Operator:</label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              style={styles.select}
            >
              <option value="">Επιλέξτε Operator...</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.op_id}>
                  {operator.name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.filterItem}>
            <label>Μήνας Οφειλής:</label>
            <input
              type="month"
              value={selectedMonth || currentMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        <button onClick={handleSearch} style={styles.button}>
          🔎 Υπολογισμός Χρέους
        </button>
      </div>

      {loading && <p>⏳ Φόρτωση...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Εμφάνιση των δεδομένων σε πίνακα */}
      {debt && Object.keys(debt).length > 0 ? (
        <>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Προς Operator</th>
              <th>Οφειλή (€)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(debt).map(([otherOperator, amount]) => (
              <tr key={otherOperator}>
                {/*<td>{otherOperator}</td>*/}
                <td style={{ color: amount < 0 ? "red" : "green" }}>
                  {amount < 0 ? `${amount} €` : "Δεν υπάρχει οφειλή"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {Object.entries(debt).find(([id, amount]) => amount < 0) && (
          <button style={styles.payButton} onClick={() => handlePayment(settlementID)}>
            Πληρωμή
          </button>
        )}
        </>
      ) : (
        <p></p>
      )}

      {paymentSuccess && <p style={{ color: "green" }}>✅ Πληρωμή ολοκληρώθηκε με επιτυχία!</p>}
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
    alignItems: "center",
    marginBottom: "30px"
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
  payButton: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "0.3s",
  },
  debtContainer: {
    marginTop: "20px",
    textAlign: "center"
  },
};

export default Payments;
