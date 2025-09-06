// server/routes/entries.js
const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");
const requireAuth = require("../middleware/auth");

// ▶️ Create a new entry

router.post("/", requireAuth, async (req, res) => {
  const { type, amount, category } = req.body;

  if (!type || !amount || !category) {
    return res.status(400).json({ message: "Type, amount, and category are required" });
  }

  try {
    const entry = new Entry({
      type,
      amount,
      category,
      user: req.user.id,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Could not create entry" });
  }
});


// ▶️ Get all entries for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch entries" });
  }
});

// ▶️ Delete an entry
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await Entry.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete entry" });
  }
});

module.exports = router;
