const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Подключение или создание базы
const db = new sqlite3.Database("timeledger.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dateTime TEXT UNIQUE,
    name TEXT,
    email TEXT,
    phone TEXT
  )`);
});

// API — получить все бронирования
app.get("/api/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY dateTime", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API — добавить бронь
app.post("/api/bookings", (req, res) => {
  const { dateTime, name, email, phone } = req.body;
  if (!dateTime || !name) return res.status(400).json({ error: "Поля обязательны" });

  db.run(
    `INSERT INTO bookings (dateTime, name, email, phone) VALUES (?, ?, ?, ?)`,
    [dateTime, name, email, phone],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 TimeLedger запущен на http://localhost:${PORT}`);
});
