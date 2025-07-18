const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const CONTACT_FILE = path.join(__dirname, 'contact-details.json');

// Get contact details
app.get('/api/contact-details', (req, res) => {
  fs.readFile(CONTACT_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read contact details.' });
    res.json(JSON.parse(data));
  });
});

// Update contact details
app.post('/api/contact-details', (req, res) => {
  const { farmAddress, farmEmail, farmPhone, farmWebsite } = req.body;
  const newDetails = { farmAddress, farmEmail, farmPhone, farmWebsite };
  fs.writeFile(CONTACT_FILE, JSON.stringify(newDetails, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save contact details.' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
