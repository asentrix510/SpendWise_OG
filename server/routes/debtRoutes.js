// server/routes/debtRoutes.js
const express = require("express");
const router = express.Router();
const Debt = require("../models/Debt");
const authMiddleware = require("../middleware/auth");

// 🔐 All routes are protected
router.use(authMiddleware);

// ➕ Add new debt
router.post("/", async (req, res) => {
  try {
    const { name, amount, type, note } = req.body;

    const newDebt = new Debt({
      userId: req.user.id,
      name,
      amount,
      type,
      note,
    });

    await newDebt.save();
    res.status(201).json(newDebt);
  } catch (err) {
    res.status(500).json({ error: "Failed to add debt" });
  }
});

// 📥 Get all debts for the user
router.get("/", async (req, res) => {
  try {
    const debts = await Debt.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch debts" });
  }
});

// ❌ Delete a debt by ID
router.delete("/:id", async (req, res) => {
  try {
    await Debt.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Debt deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete debt" });
  }
});

// ✏️ Update a debt by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, amount, type, note } = req.body;

    const updatedDebt = await Debt.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // match both ID and user
      { name, amount, type, note },
      { new: true } // return updated document
    );

    if (!updatedDebt) {
      return res.status(404).json({ error: "Debt not found or unauthorized" });
    }

    res.json(updatedDebt);
  } catch (err) {
    res.status(500).json({ error: "Failed to update debt" });
  }
});


module.exports = router;
