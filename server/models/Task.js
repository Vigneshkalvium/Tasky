const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },   // task's date (calendar date)
  time: { type: String, default: '' },    // optional time string like "14:30" or "2:30 PM"
  xp: { type: Number, default: 0 },       // xp granted for completing this task
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  details: { type: Object, default: {} }, // store particular details for every task (free-form)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
