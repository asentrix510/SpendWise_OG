import React from "react";

const EntryList = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return <p>No entries yet. Start tracking!</p>;
  }

  return (
    <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Note</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry._id}>
            <td>{entry.type}</td>
            <td>{entry.amount}</td>
            <td>{entry.note || "-"}</td>
            <td>{new Date(entry.date).toLocaleDateString()}</td>
            <td>
              <button onClick={() => onDelete(entry._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EntryList;
