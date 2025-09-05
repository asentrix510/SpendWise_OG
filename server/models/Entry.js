// server/models/Entry.js
const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["expense", "saving"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
    category: {
    type: String,
    required: true, // or false, if you want to make it optional for now
    enum: [
      "food",
      "games",
      "stationary",
      "grocery",
      "transport",
      "entertainment",
      "health",
      "others",
    ],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Entry", entrySchema);
