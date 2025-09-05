import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ⬅ Import Link
import API from "../api";
import "./Register.css"; // ⬅ Add styling

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      setMsg(res.data.message);
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="logo">SpendWise</h1>
        <p className="subtitle">Sign up to start tracking your money 🚀</p>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {msg && <p className="error-msg">{msg}</p>}

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;