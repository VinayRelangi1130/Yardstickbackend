const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./transactions.db');

db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  amount REAL,
  date TEXT
)`);

app.get('/transactions', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/transactions', (req, res) => {
  const { description, amount, date } = req.body;
  if (!description || !amount || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.run('INSERT INTO transactions (description, amount, date) VALUES (?, ?, ?)', [description, amount, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, description, amount, date });
  });
});

app.put('/transactions/:id', (req, res) => {
    const { description, amount, date } = req.body;
    const { id } = req.params;
  
    if (!description || !amount || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    db.run(
      'UPDATE transactions SET description = ?, amount = ?, date = ? WHERE id = ?',
      [description, amount, date, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, description, amount, date });
      }
    );
  });

app.delete('/transactions/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${5000}`));
