import pool from './db.js';

export async function getAllCategories() {
    const sql = `
        SELECT *
        FROM category
        ORDER BY name;
    `;

    const result = await pool.query(sql);
    return result.rows;
}