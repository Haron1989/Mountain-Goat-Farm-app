const User = require('./user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'goatfarmsecret';
// Register new user
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password.' });
  try {
    const user = new User({ username, password, role });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password.' });
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Auth middleware
function requireAuth(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided.' });
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden.' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token.' });
    }
  };
}
const HealthRecord = require('./health-records');
// Get health records
app.get('/api/health-records', async (req, res) => {
  try {
    const records = await HealthRecord.find().sort({ checkupDate: -1 }).exec();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch health records.' });
  }
});

// Add new health record
app.post('/api/health-records', async (req, res) => {
  const { goatId, checkupDate, treatment, status } = req.body;
  if (!goatId || !checkupDate || !status) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    await HealthRecord.create({ goatId, checkupDate, treatment, status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save health record.' });
  }
});
const BreedingRecord = require('./breeding-records');
// Get breeding records
app.get('/api/breeding-records', async (req, res) => {
  try {
    const records = await BreedingRecord.find().sort({ kiddingDate: -1 }).exec();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch breeding records.' });
  }
});

// Add new breeding record
app.post('/api/breeding-records', async (req, res) => {
  const { goatId, pregnant, kiddingDate, lineage, success } = req.body;
  if (!goatId || typeof pregnant === 'undefined' || !lineage) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    await BreedingRecord.create({ goatId, pregnant, kiddingDate, lineage, success });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save breeding record.' });
  }
});
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

mongoose.connect('mongodb://localhost:27017/mountain_goat_farm', { useNewUrlParser: true, useUnifiedTopology: true });

const auditLogSchema = new mongoose.Schema({
  timestamp: String,
  user: String,
  action: String,
  details: String
});
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

const wss = new WebSocket.Server({ server });

function broadcastAuditLog(log) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(log));
    }
  });
}

// Get contact details
// Get contact details (unchanged)
const CONTACT_FILE = path.join(__dirname, 'contact-details.json');
app.get('/api/contact-details', (req, res) => {
  // ...existing code...
});
app.post('/api/contact-details', (req, res) => {
  // ...existing code...
});

// Get audit log data from MongoDB
app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).exec();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

// Add new audit log entry to MongoDB and broadcast via WebSocket
app.post('/api/audit-logs', async (req, res) => {
  const { timestamp, user, action, details } = req.body;
  if (!timestamp || !user || !action || !details) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    await AuditLog.create({ timestamp, user, action, details });
    broadcastAuditLog({ timestamp, user, action, details });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save audit log.' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
