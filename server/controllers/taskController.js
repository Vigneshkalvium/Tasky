const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Create task (for today or any date/time)
 * body: { title, description, date, time, xp, details }
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, date, time, xp, details } = req.body;
    if (!title || !date) return res.status(400).json({ error: 'Title and date are required' });

    const taskDate = new Date(date);
    if (isNaN(taskDate)) return res.status(400).json({ error: 'Invalid date' });

    const task = new Task({
      user: req.user._id,
      title,
      description: description || '',
      date: taskDate,
      time: time || '',
      xp: Number(xp) || 0,
      details: details || {}
    });

    await task.save();
    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all tasks for user, optional query:
 *  - ?date=YYYY-MM-DD  (gets tasks for that date)
 *  - ?from=ISO&to=ISO  (range)
 */
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, from, to } = req.query;
    let filter = { user: userId };

    if (date) {
      // match tasks whose date falls on that calendar day (UTC)
      const d = new Date(date);
      if (isNaN(d)) return res.status(400).json({ error: 'Invalid date query param' });
      const start = new Date(d.setUTCHours(0, 0, 0, 0));
      const end = new Date(d.setUTCHours(23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    } else if (from || to) {
      const range = {};
      if (from) {
        const f = new Date(from);
        if (isNaN(f)) return res.status(400).json({ error: 'Invalid from date' });
        range.$gte = f;
      }
      if (to) {
        const t = new Date(to);
        if (isNaN(t)) return res.status(400).json({ error: 'Invalid to date' });
        range.$lte = t;
      }
      filter.date = range;
    }

    const tasks = await Task.find(filter).sort({ date: 1, time: 1 });
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get single task by id
 */
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update task
 * body: any of { title, description, date, time, xp, details }
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    // only update allowed fields
    const allowed = ['title', 'description', 'date', 'time', 'xp', 'details', 'completed'];
    for (const key of Object.keys(updates)) {
      if (allowed.includes(key)) task[key] = updates[key];
    }

    await task.save();
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Delete task
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Mark task as complete — gives XP to user and increments streak +1 (only if not already completed)
 */
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid task id' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    if (task.completed) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // mark task completed
    task.completed = true;
    task.completedAt = new Date();
    await task.save();

    // update user: add xp and increment streak by 1
    const user = await User.findById(req.user._id);
    user.xp = (user.xp || 0) + (Number(task.xp) || 0);
    user.streak = (user.streak || 1) + 1;
    await user.save();

    res.json({ task, user: { id: user._id, xp: user.xp, streak: user.streak } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
