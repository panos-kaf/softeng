import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9115/api/login", {
        username,
        password,
      });

      // Αποθήκευση JWT token στο Local Storage
      localStorage.setItem("token", response.data.token);
      
      // Μετάβαση στο Home
      navigate("/home");
    } catch (err) {
      setError("Λάθος username ή κωδικός");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Σύνδεση</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        {/* Username Input */}
        <input
          type="text"
          placeholder="Όνομα Χρήστη"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Κωδικός"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {/* Login Button */}
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
