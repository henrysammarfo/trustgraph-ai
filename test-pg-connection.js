const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a new pool using the NEON_DATABASE_URL
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon's SSL
  }
});

async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    if (client) {
      await client.release();
    }
    await pool.end();
  }
}

testConnection();
