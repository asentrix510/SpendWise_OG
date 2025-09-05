import React from 'react';

const AIOverview = ({ expenses, savings }) => {
  const totalExpenses = expenses.toFixed(2);
  const totalSavings = savings.toFixed(2);
  const netBalance = (savings - expenses).toFixed(2);
  
  const recommendations = [];

  if (totalExpenses > totalSavings) {
    recommendations.push(
      "📉 Your expenses are currently higher than your savings. Consider reviewing your spending habits to improve your net balance."
    );
  } else if (totalSavings > 0 && totalExpenses > 0) {
    recommendations.push(
      "📈 Great job! You are saving more than you are spending. Keep up the good work!"
    );
  }

  // --- Add more sophisticated logic here based on your data ---
  // Example: If food expenses are high
  // if (categoryTotals.food > someThreshold) {
  //   recommendations.push("You're spending a lot on food. Try cooking at home more often to save money.");
  // }

  return (
    <div className="ai-overview">
      <h3>AI Insights & Recommendations 🤖</h3>
      <p>
        Your total expenses are **₹{totalExpenses}** and your total savings are **₹{totalSavings}**, resulting in a net balance of **₹{netBalance}**.
      </p>
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h4>Areas for Improvement:</h4>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIOverview;