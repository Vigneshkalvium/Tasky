const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// All routes are protected: require Authorization: Bearer <token>

// Create a task
router.post('/', auth, taskController.createTask);

// Get tasks, optionally by date (?date=YYYY-MM-DD) or range (?from=ISO&to=ISO)
router.get('/', auth, taskController.getTasks);

// Get single task
router.get('/:id', auth, taskController.getTaskById);

// Update task
router.put('/:id', auth, taskController.updateTask);

// Delete task
router.delete('/:id', auth, taskController.deleteTask);

// Mark complete -> adds xp and increments streak +1
router.post('/:id/complete', auth, taskController.completeTask);

module.exports = router;
