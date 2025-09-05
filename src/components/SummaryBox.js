import React from "react";

const SummaryBox = ({ entries }) => {
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaving = entries
    .filter((e) => e.type === "saving")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalSaving - totalExpense;

  return (
    <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Summary</h3>
      <p><strong>Total Expense:</strong> ₹{totalExpense}</p>
      <p><strong>Total Saving:</strong> ₹{totalSaving}</p>
      <p><strong>Net Balance:</strong> ₹{netBalance}</p>
    </div>
  );
};

export default SummaryBox;
