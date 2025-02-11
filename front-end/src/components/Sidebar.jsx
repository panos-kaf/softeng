import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("role");  
    navigate("/login"); 
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title} onClick={() => navigate(`/${role}/home`)}>Admin Dashboard</h2>
      <ul style={styles.list}>
        <li>
          <NavLink to={`/${role}/home`} style={getLinkStyle} end>🏠 Αρχική</NavLink>
        </li>
        <li>
          <NavLink to={`/${role}/passes`} style={getLinkStyle}>🚗 Διελεύσεις</NavLink>
        </li>
        {role === "user" && (
        <li>
          <NavLink to={`/${role}/payments`} style={getLinkStyle}>💳 Πληρωμές</NavLink>
        </li>
        )}
        {role === "admin" && (
          <li>
            <NavLink to={`/${role}/settings`} style={getLinkStyle}>⚙️ Διαχείριση</NavLink>
          </li>
        )}
      </ul>

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutButton}>
        🚪 Αποσύνδεση
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "95vh",
    backgroundColor: "#282c34",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "20px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "white",
    display: "block",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    transition: "background 0.3s ease",
  },
  activeLink: {
    backgroundColor: "#4a6fa5",
    color: "#282c34",
  },
  logoutButton: {
    marginTop: "auto",
    padding: "10px",
    backgroundColor: "#3a506b",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
    textAlign: "center",
  },
};

const getLinkStyle = ({ isActive }) => ({
  ...styles.link,
  ...(isActive ? styles.activeLink : {}),
});

export default Sidebar;
