const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user; // attach user object
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;
