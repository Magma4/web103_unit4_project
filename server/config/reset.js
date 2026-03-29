import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const { pool } = await import('./database.js')

const reset = async () => {
    try {
        await pool.query(`
            DROP TABLE IF EXISTS custom_items CASCADE;
        `)

        await pool.query(`
            CREATE TABLE custom_items (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                selections JSONB NOT NULL DEFAULT '{}',
                total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `)

        console.log('Database tables reset successfully.')
    } catch (err) {
        console.error('Error resetting database:', err)
        process.exitCode = 1
    } finally {
        await pool.end()
    }
}

reset()
