import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';

// This page is for fetching the data for the calendar feature 

// Creating Pool to manage multiple database connections
const { Pool } = pg;

// Creates connection pool to the PostgreSQL database using the connection string 
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

// Asynchronous function which handles HTTP requests 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // Extracts the id parameter from the query string 
    const { id } = req.query;
    
    try {

        // Retrives a client from connection pool to interact with database
        const client = await pool.connect();

        // Performing a SQL query to fetch bookings by car_id 
        const result = await client.query(`
        SELECT id, start_date, end_date, status 
        FROM bookings
        WHERE car_id = $1
      `, [id]); // Using parameterized query to prevent SQL injection 

     client.release();

     // Sends a 200 OK respone with the data retrived from the database
     res.status(200).json(result.rows);
    } catch (err) {
        // Catch errors if they occur here
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error '});
    }
}