import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';

// This page is for creating new bookings in the database and storing them 

// Creating Pool to manage multiple database connections
const { Pool } = pg;

// Creates connection pool to the PostgreSQL database using the connection string 
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

// Asynchronous function which handles HTTP requests 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'POST') {

        const { car_id, start_date, end_date, status} = req.body;
    
        try {

            // Retrives a client from connection pool to interact with database
            const client = await pool.connect();

            const result = await client.query(`
            INSERT INTO bookings (car_id, start_date, end_date, status, extra_ids)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [car_id, start_date, end_date, status]);

        client.release();

        res.status(201).json(result.rows[0]);
        } catch (err) {
            // Catch errors if they occur here
            console.error('Error creating booking: ', err);
            res.status(500).json({ error: 'Internal Server Error '});
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed'});
    }
}
