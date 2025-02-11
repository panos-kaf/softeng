import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Payments = () => {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [debt, setDebt] = useState();
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
          console.error("❌ Δεν υπάρχει token!");
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
        console.error("❌ Σφάλμα φόρτωσης operators:", error.response ? error.response.data : error);
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
        acc[entry.to_operator] = parseFloat(entry.amount); // Μετατροπή σε αριθμό
        return acc;
      }, {});
      
      console.log("📊 Μετασχηματισμένο Debt:", formattedDebt);
      setDebt(formattedDebt);
      

    } catch (err) {
      console.error("❌ Σφάλμα φόρτωσης χρέους:", err.response ? err.response.data : err);
      setError("❌ Σφάλμα φόρτωσης χρέους.");
    }
  
    setLoading(false);
  };
  
  

  const handlePayment = async () => {
    if (!debt || debt === 0) {
      setError("Δεν υπάρχει ποσό προς πληρωμή!");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API_URL}/getSettlement/`,
        {
          operatorID: selectedOperator,
          amount: debt,
          monthYear: selectedMonth.replace(/-/g, "") + "01", // Αφαιρούμε τις παύλες πριν στείλουμε το μήνα
        },
        {
          headers: { "x-observatory-auth": token },
        }
      );

      console.log("✅ Πληρωμή επιτυχής:", response.data);
      setPaymentSuccess(true);
      setDebt(null); // Μηδενίζουμε το χρέος μετά την πληρωμή
    } catch (err) {
      console.error("❌ Σφάλμα κατά την πληρωμή:", err.response ? err.response.data : err);
      setError("❌ Η πληρωμή απέτυχε.");
    }

    setLoading(false);
  };

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
                <td>{otherOperator}</td>
                <td style={{ color: amount < 0 ? "red" : "green" }}>
                  {amount < 0 ? `${amount} €` : "Δεν υπάρχει οφειλή"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Δεν υπάρχουν χρέη για τον επιλεγμένο operator.</p>
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
  payButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
  },
  debtContainer: {
    marginTop: "20px",
    textAlign: "center"
  },
};

export default Payments;
