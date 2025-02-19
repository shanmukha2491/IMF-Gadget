
import pkg from 'pg';
const { Pool } = pkg;
import "dotenv/config"
// const pool =  new Pool({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT
// });

const pool =new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Enables SSL for production

})
pool.connect()
    .then(client => {
        console.log("✅ Connected to PostgreSQL");
        client.release();
    })
    .catch(err => console.error("❌ PostgreSQL Connection Error:", err.message));


export default pool;

