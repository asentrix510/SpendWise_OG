import React, { useState } from "react";
import API from "../api";

const EntryForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/entries", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAdd(res.data);
      // Reset form
      setForm({
        type: "expense",
        amount: "",
        category: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error adding entry:", err);
      alert(err.response?.data?.message || "Error adding entry");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <select name="type" value={form.type} onChange={handleChange} required>
        <option value="expense">Expense</option>
        <option value="saving">Saving</option>
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="note"
        placeholder="Note"
        value={form.note}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button type="submit">Add Entry</button>
    </form>
  );
};

export default EntryForm;
