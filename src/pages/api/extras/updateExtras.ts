import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';

// This page updates the quantity of the extras in the database

// Creating Pool to manage multiple database connections
const { Pool } = pg;

// Creates connection pool to the PostgreSQL database using the connection string 
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

// Asynchronous function which handles HTTP requests 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'POST') {

        const { id, quantity } = req.body;
    
        try {

            // Retrives a client from connection pool to interact with database
            const client = await pool.connect();

            const result = await client.query(`
            UPDATE extras
            SET available_quantity = available_quantity - $1
            WHERE id = $2
            RETURNING *;
        `, [id, quantity]);

        client.release();

        res.status(201).json(result.rows[0]);
        } catch (err) {
            // Catch errors if they occur here
            console.error('Error checking out: ', err);
            res.status(500).json({ error: 'Internal Server Error '});
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed'});
    }
}
