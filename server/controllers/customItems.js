import { pool } from '../config/database.js'

export const getAllCustomItems = async () => {
    const { rows } = await pool.query(
        `SELECT id, name, selections, total_price, created_at, updated_at
         FROM custom_items
         ORDER BY created_at DESC`
    )
    return rows
}

export const getCustomItemById = async (id) => {
    const { rows } = await pool.query(
        `SELECT id, name, selections, total_price, created_at, updated_at
         FROM custom_items
         WHERE id = $1`,
        [id]
    )
    return rows[0] ?? null
}

export const createCustomItem = async ({ name, selections, total_price }) => {
    const { rows } = await pool.query(
        `INSERT INTO custom_items (name, selections, total_price)
         VALUES ($1, $2::jsonb, $3)
         RETURNING id, name, selections, total_price, created_at, updated_at`,
        [name, JSON.stringify(selections ?? {}), total_price]
    )
    return rows[0]
}

export const updateCustomItem = async (id, { name, selections, total_price }) => {
    const { rows } = await pool.query(
        `UPDATE custom_items
         SET name = $2,
             selections = $3::jsonb,
             total_price = $4,
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, selections, total_price, created_at, updated_at`,
        [id, name, JSON.stringify(selections ?? {}), total_price ?? 0]
    )
    return rows[0] ?? null
}

export const deleteCustomItem = async (id) => {
    const { rows } = await pool.query(
        `DELETE FROM custom_items WHERE id = $1 RETURNING id`,
        [id]
    )
    return rows[0] ?? null
}
