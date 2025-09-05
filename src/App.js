// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Tracker from "./pages/Tracker";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on app load
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>SpendWise</h1>
        {/* {isLoggedIn && <button onClick={handleLogout}>Logout</button>} */}

        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? "/tracker" : "/login"} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/tracker" element={isLoggedIn ? <Tracker /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
