import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';

// Creating Pool to manage multiple database connections
const { Pool } = pg;

// Creates connection pool to the PostgreSQL database using the connection string 
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

// Asynchronous function which handles HTTP requests 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    const { id } = req.query;
    
    try {

        // Retrives a client from connection pool to interact with database
        const client = await pool.connect();

        /* Helping to execute a SQL query. Query selects three fields car_name, short_description from the cars table
           and image_url from the car_images table. INNER JOIN joins the cars and car_images tables on the id field 
           of cars and the car_id field of car_images   
        */
        const result = await client.query(`
        SELECT c.car_name, c.make, c.model, c.year, c.type, c.mpg, c.gas_type, c.num_doors, c.num_seats, c.long_description, ci.image_url
        FROM cars c
        INNER JOIN car_images ci ON c.id = ci.car_id
        WHERE c.id = $1
      `, [id]);

     client.release();

     // Sends a 200 OK respone with the data retrived from the database
     res.status(200).json(result.rows);
    } catch (err) {
        // Catch errors if they occur here
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal Server Error '});
    }
}