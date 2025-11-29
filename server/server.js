require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// connect to DB
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// health
app.get('/', (req, res) => res.json({ ok: true, message: 'Tasky backend running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
