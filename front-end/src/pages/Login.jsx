
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
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

        localStorage.setItem("token", response.data.token); // Αποθήκευση JWT token
        navigate("/"); 
    } catch (err) {
        setError("Λάθος username ή κωδικός");
    }
};


  return (
    <div style={styles.container}>
      <h2>Σύνδεση</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

    
        <button 
            onClick={() => {
        localStorage.setItem("token", "testToken");
        navigate("/");
         }} 
        style={{ marginTop: "10px", padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}   
>
            🚀 Test Login (Παράκαμψη)
        </button>

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
// dasdsadasada
export default Login;
