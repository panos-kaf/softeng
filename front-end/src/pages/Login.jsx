import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      console.log("🔵 Αποστολή Login Request:", { username, password });

      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      console.log("API Response:", response.data);

      // Πάρε το token και το role από το API response
      const { token, role } = response.data;

      if (!token || !role) {
        console.error("Το API δεν επέστρεψε σωστά το token ή το role!");
        setError("Σφάλμα σύνδεσης. Δοκίμασε ξανά.");
        return;
      }

      // Αποθήκευση στο Local Storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("operator_id", response.data.operator_id);

      console.log("Operator ID από localStorage:", localStorage.getItem("operator_id"));


      console.log("Token αποθηκεύτηκε:", token);
      console.log("Role αποθηκεύτηκε:", role);

      // Ανακατεύθυνση στο σωστό Dashboard
      const newUrl = role === "admin" ? "/admin/home" : "/user/home";
      navigate(newUrl);

    } catch (err) {
      console.error("Σφάλμα κατά το login:", err.response ? err.response.data : err.message);
      setError("Λάθος username ή κωδικός");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Σύνδεση</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Όνομα Χρήστη"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Κωδικός"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Σύνδεση</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw", 
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#3a506b",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default Login;
