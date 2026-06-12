import db from './db.js';
import bcrypt from 'bcrypt';

/* ------------------------
   CREATE USER
------------------------ */
const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user';

    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES (
            $1,
            $2,
            $3,
            (SELECT role_id FROM roles WHERE role_name = $4)
        )
        RETURNING user_id
    `;

    const result = await db.query(query, [
        name,
        email,
        passwordHash,
        defaultRole
    ]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

/* ------------------------
   FIND USER BY EMAIL
   (THIS IS THE CRITICAL FIX)
------------------------ */
const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/* ------------------------
   PASSWORD CHECK
------------------------ */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/* ------------------------
   AUTHENTICATE USER
------------------------ */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) return null;

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) return null;

    // remove sensitive data
    delete user.password_hash;

    return user;
};

/* ------------------------
   EXPORTS
------------------------ */
export {
    createUser,
    authenticateUser
};