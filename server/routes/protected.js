const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");

router.get("/me", requireAuth, async (req, res) => {
  res.json({ message: "You are authenticated", userId: req.userId });
});

module.exports = router;
