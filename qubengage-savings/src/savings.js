// savings.js
const express = require('express');
const mysql = require('promise-mysql');
const cors = require('cors');
require('dotenv').config();

const createUnixSocketPool = async () => {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: process.env.INSTANCE_UNIX_SOCKET,
  });
};

const poolPromise = createUnixSocketPool();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/create-tables', async (req, res) => {
  const createStudentsTableQuery = `
    CREATE TABLE IF NOT EXISTS Students (
      StudentID VARCHAR(20) PRIMARY KEY,
      FirstName VARCHAR(255),
      LastName VARCHAR(255)
    )`;

  const createStudentEngagementTableQuery = `
    CREATE TABLE IF NOT EXISTS StudentEngagement (
      EngagementID INT AUTO_INCREMENT PRIMARY KEY,
      StudentID VARCHAR(20),
      LectureHours DECIMAL(5,2),
      LabHours DECIMAL(5,2),
      SupportHours DECIMAL(5,2),
      CanvasActivitiesHours DECIMAL(5,2),
      CutoffScore DECIMAL(5,2),
      DateLogged DATE,
      FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
    )`;

  try {
    const pool = await poolPromise;
    await pool.query(createStudentsTableQuery);
    await pool.query(createStudentEngagementTableQuery);
    console.log('Students and StudentEngagement tables created successfully.');
    res.status(200).send('Students and StudentEngagement tables created successfully');
  } catch (error) {
    console.error('Failed to create tables:', error);
    res.status(500).send('Failed to create tables');
  }
});

// Add new student information
app.post('/student', async (req, res) => {
  const { StudentID, FirstName, LastName } = req.body;
  try {
    const pool = await poolPromise;
    await pool.query(
      'INSERT INTO Students (StudentID, FirstName, LastName) VALUES (?, ?, ?)',
      [StudentID, FirstName, LastName]
    );
    res.status(201).json({ message: "Student added successfully." });
  } catch (error) {
    console.error('Failed to insert student data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Access to all student engagement data
app.get('/load', async (req, res) => {
  try {
    const pool = await poolPromise;
    const results = await pool.query('SELECT * FROM StudentEngagement');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new student engagement record
app.post('/save', async (req, res) => {
  const { StudentID, LectureHours, LabHours, SupportHours, CanvasActivitiesHours, CutoffScore } = req.body;
  const DateLogged = new Date(); // Use current date or take from request
  try {
    const pool = await poolPromise;
    const result = await pool.query(
      'INSERT INTO StudentEngagement (StudentID, LectureHours, LabHours, SupportHours, CanvasActivitiesHours, CutoffScore, DateLogged) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [StudentID, LectureHours, LabHours, SupportHours, CanvasActivitiesHours, CutoffScore, DateLogged]
    );
    res.status(201).json({ EngagementID: result.insertId });
  } catch (error) {
    console.error('Failed to insert engagement data:', error);
    res.status(500).json({ error });
  }
});

// Get all participation records for a given student
app.get('/load/:StudentID', async (req, res) => {
  const { StudentID } = req.params;
  try {
    const pool = await poolPromise;
    const results = await pool.query('SELECT * FROM StudentEngagement WHERE StudentID = ?', [StudentID]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Engagement data not found for the given student.' });
    }
    res.json(results);
  } catch (error) {
    console.error('Failed to retrieve engagement data:', error);
    res.status(500).json({ error });
  }
});

// Test database connection
app.get('/testdb', async (req, res) => {
  try {
    const pool = await poolPromise;
    const results = await pool.query('SELECT 1 + 1 AS solution');
    res.send('The solution is: ' + results[0].solution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Local Testing
// const PORT = 3000;
// app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
// });

exports.app = app;
