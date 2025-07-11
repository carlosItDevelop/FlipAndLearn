const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'https://' + process.env.REPL_SLUG + '-5000.' + process.env.REPL_OWNER + '.repl.co'],
  credentials: true
}));
app.use(express.json());

// Database connection - using standard pg instead of @neondatabase/serverless for better compatibility
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Routes
app.get('/api/lessons', async (req, res) => {
  try {
    const { level } = req.query;
    let query = 'SELECT * FROM lessons ORDER BY id';
    let values = [];
    
    if (level && level !== 'Todos') {
      query = 'SELECT * FROM lessons WHERE level = $1 ORDER BY id';
      values = [level];
    }
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

app.post('/api/lessons', async (req, res) => {
  try {
    const { level, englishText, portugueseText } = req.body;
    
    if (!level || !englishText || !portugueseText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const query = 'INSERT INTO lessons (level, english_text, portuguese_text) VALUES ($1, $2, $3) RETURNING *';
    const values = [level, englishText, portugueseText];
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

app.get('/api/env', (req, res) => {
  res.json({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${port}`);
});