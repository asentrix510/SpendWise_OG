import React, { useEffect, useMemo, useState } from "react";
import "./Tracker.css";
import SplitText from "../components/SplitText";
import SplashCursor from "../components/SplashCursor";
import Navbar from "../components/Navbar";
import AIOverview from "../components/AIOverview"; // ⬅ Import the new component
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer
} from "recharts";
const CATEGORIES = [
  { key: "food", icon: "🍔", label: "Food" },
  { key: "entertainment", icon: "🎬", label: "Entertainment" },
  { key: "shopping", icon: "🛍️", label: "Shopping" },
  { key: "travel", icon: "✈️", label: "Travel" },
  { key: "stationary", icon: "✏️", label: "Stationery" },
  { key: "gifts", icon: "🎁", label: "Gifts" },
  { key: "others", icon: "📦", label: "Others" },
];

const PIE_COLORS = [
  "#ff6b6b",
  "#4dabf7",
  "#ffd43b",
  "#51cf66",
  "#845ef7",
  "#ffa94d",
  "#94d82d",
];

export default function Tracker() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("trackerEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [darkMode, setDarkMode] = useState(true);
  const [entryDate, setEntryDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [rangeFilter, setRangeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [budgetLimits, setBudgetLimits] = useState(() => {
    const saved = localStorage.getItem("budgetLimits");
    return (
      saved || {
        food: 5000,
        entertainment: 3000,
        shopping: 4000,
        travel: 5000,
        stationary: 2000,
        gifts: 2500,
        others: 3000,
      }
    );
  });
  useEffect(() => {
    localStorage.setItem("trackerEntries", JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem("budgetLimits", JSON.stringify(budgetLimits));
  }, [budgetLimits]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };
  const handleAddEntry = () => {
    if (!amount) return;
    const newEntry = {
      id: Date.now(),
      amount: parseFloat(amount),
      type,
      category: type === "expense" ? category : null,
      date: new Date().toISOString().split("T")[0],
    };
    setEntries([newEntry, ...entries]);
    setAmount("");
  };
  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };
  const filterByRange = (arr, range) => {
    if (range === "all") return arr;
    const now = new Date();
    let start = null;
    if (range === "today") {
      return arr.filter((e) => new Date(e.date).toDateString() === now.toDateString());
    }
    const startOfWeek = () => {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.getFullYear(), d.getMonth(), diff);
    };
    const startOfMonth = () => {
      const d = new Date(now);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    };
    const startOfYear = () => {
      const d = new Date(now);
      return new Date(d.getFullYear(), 0, 1);
    };
    if (range === "week") start = startOfWeek();
    if (range === "month") start = startOfMonth();
    if (range === "year") start = startOfYear();
    return arr.filter((e) => new Date(e.date) >= start);
  };
  const filteredEntries = useMemo(() => {
    const base = filterByRange(entries, rangeFilter);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((e) => {
      const cat = e.category || "";
      return (
        cat.toLowerCase().includes(q) ||
        String(e.amount).includes(q) ||
        (e.note || "").toLowerCase().includes(q)
      );
    });
  }, [entries, rangeFilter, search]);
  const totalExpenses = filteredEntries
    .filter((e) => e.type === "expense")
    .reduce((acc, e) => acc + e.amount, 0);
  const totalSavings = filteredEntries
    .filter((e) => e.type === "saving")
    .reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalSavings - totalExpenses;
  const categoryTotals = useMemo(() => {
    const map = {};
    filteredEntries
      .filter((e) => e.type === "expense")
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return map;
  }, [filteredEntries]);
  const pieData = useMemo(() => {
    return CATEGORIES.map((c) => ({
      name: c.label,
      key: c.key,
      value: categoryTotals[c.key] || 0,
    })).filter((d) => d.value > 0);
  }, [categoryTotals]);
  const { monthSavings, monthExpenses } = useMemo(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    let ms = 0;
    let me = 0;
    entries.forEach((e) => {
      const entryDate = new Date(e.date);
      if (entryDate >= start) {
        if (e.type === "saving") ms += e.amount;
        else if (e.type === "expense") me += e.amount;
      }
    });
    return { monthSavings: ms, monthExpenses: me };
  }, [entries]);
  const exceededCats = useMemo(() => {
    return Object.keys(budgetLimits).filter(
      (k) => (categoryTotals[k] || 0) > Number(budgetLimits[k] || 0)
    );
  }, [categoryTotals, budgetLimits]);
  const visibleEntries = showAll
    ? filteredEntries
    : filteredEntries.slice(0, 10);
  const handleBudgetChange = (key, value) => {
    setBudgetLimits((prev) => ({
      ...prev,
      [key]: value.replace(/[^\d.]/g, ""),
    }));
  };

  return (
    <div className={`tracker-wrapper ${darkMode ? "dark" : ""}`}>
      <SplashCursor />
      <div className="background-animation" />
      <Navbar
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
      />
      <div className="tracker-container">
        <SplitText
          text="SpendWise Tracker"
          className="split-parent"
          delay={60}
          duration={0.5}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <div className="summary-section">
          <p className="expense">Total Expenses: ₹{totalExpenses.toFixed(2)}</p>
          <p className="saving">Total Savings: ₹{totalSavings.toFixed(2)}</p>
          <p className={`net ${netBalance < 0 ? "negative" : "positive"}`}>
            Net Balance: ₹{netBalance.toFixed(2)}
          </p>
        </div>

        {/* ⬅ Render the AI Overview component here */}
        <AIOverview expenses={totalExpenses} savings={totalSavings} />

        <div className="filters-row">
          <div className="filter-buttons">
            {["all", "today", "week", "month", "year"].map((r) => (
              <button
                key={r}
                className={`chip ${rangeFilter === r ? "active" : ""}`}
                onClick={() => setRangeFilter(r)}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="Search by category, amount or note"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="entry-form">
          <div className="row">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="type-select"
            >
              <option value="expense">Expense</option>
              <option value="saving">Saving</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
            <button className="primary" onClick={handleAddEntry}>
              Add
            </button>
          </div>
          {type === "expense" && (
            <div className="category-scroll" role="tablist" aria-label="categories">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c.key}
                  className={`category-btn ${category === c.key ? "active" : ""}`}
                  onClick={() => setCategory(c.key)}
                >
                  <span className="cat-emoji">{c.icon}</span>
                  <span className="cat-label">{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="budget-panel">
          <div className="budget-header">
            <h3>Budgets</h3>
            {exceededCats.length > 0 && (
              <span className="over-badge">⚠ Over budget</span>
            )}
          </div>
          <div className="budget-grid">
            {CATEGORIES.map((c) => {
              const spent = categoryTotals[c.key] || 0;
              const limit = Number(budgetLimits[c.key] || 0);
              const over = spent > limit && limit > 0;
              return (
                <div key={c.key} className={`budget-card ${over ? "over" : ""}`}>
                  <div className="budget-title">
                    <span className="cat-emoji small">{c.icon}</span>
                    <strong>{c.label}</strong>
                  </div>
                  <div className="budget-values">
                    <div>Spent: ₹{spent.toFixed(0)}</div>
                    <div>
                      Limit: ₹
                      <input
                        value={budgetLimits[c.key]}
                        onChange={(e) => handleBudgetChange(c.key, e.target.value)}
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                  {over && <div className="warn">⚠ Over by ₹{(spent - limit).toFixed(0)}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="charts-wrap">
          <div className="chart-card">
            <h3>Expenses by Category {rangeFilter !== "all" ? `(${rangeFilter})` : ""}</h3>
            <div className="chart-body">
              {pieData.length === 0 ? (
                <div className="empty-chart">No expense data in this range.</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="chart-card">
            <h3>This Month: Savings vs Expenses</h3>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: "This Month", expenses: monthExpenses, savings: monthSavings }]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expenses" fill="#e74c3c" />
                  <Bar dataKey="savings" fill="#2ecc71" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="entries-section">
          <h3 className="section-title">Records</h3>
          <ul>
            {visibleEntries.map((entry) => {
              const isExpense = entry.type === "expense";
              const d = new Date(entry.date);
              const dateStr = d.toLocaleDateString();
              const catMeta =
                CATEGORIES.find((c) => c.key === entry.category) ||
                { icon: isExpense ? "💸" : "💰", label: entry.category };
              return (
                <li
                  key={entry.id}
                  className={`transaction-item ${isExpense ? "expense" : "saving"}`}
                >
                  <span className="left">
                    <span className="circle">{catMeta.icon}</span>
                    <span className="main">
                      <span className="amount">
                        {isExpense ? "–" : "+"} ₹{entry.amount.toFixed(2)}
                      </span>
                      <span className="meta">
                        {isExpense ? catMeta.label : "Saving"} • {dateStr}
                      </span>
                    </span>
                  </span>
                  <button className="ghost" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
          {filteredEntries.length > 10 && (
            <button className="showmore-btn" onClick={() => setShowAll((s) => !s)}>
              {showAll ? "Show Less" : `Show More (${filteredEntries.length - 10})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}