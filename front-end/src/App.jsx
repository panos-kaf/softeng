import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Passes from "./pages/Passes";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import Login from "./pages/Login"; 

const isAuthenticated = () => !!localStorage.getItem("token"); // Έλεγχος αν υπάρχει token
const getUserRole = () => localStorage.getItem("role"); // Παίρνουμε τον ρόλο του χρήστη

// Προστατευμένες διαδρομές με έλεγχο ρόλου
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getUserRole();
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" />; // Αν δεν έχει το σωστό role, επιστροφή στο login
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1, padding: "20px" }}>
                  <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="passes" element={<Passes />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ flex: 1, padding: "20px" }}>
                  <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="passes" element={<Passes />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirect to Login if no route matches */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

