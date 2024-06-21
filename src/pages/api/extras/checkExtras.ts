import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';

// This page checks for the available extras in the database

// Creating Pool to manage multiple database connections
const { Pool } = pg;

// Creates connection pool to the PostgreSQL database using the connection string 
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

// Asynchronous function which handles HTTP requests 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        // Retrives a client from connection pool to interact with database
        const client = await pool.connect();

        // Helping to execute a SQL query.  
        const result = await client.query(`
        SELECT id, name, description, available_quantity, price_type, price_amount
        FROM extras
        WHERE available = true OR available_quantity IS NULL;
    `);

     client.release();

     // Sends a 200 OK respone with the data retrived from the database
     res.status(200).json(result.rows);
    } catch (err) {
        // Catch errors if they occur here
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error '});
    }
}