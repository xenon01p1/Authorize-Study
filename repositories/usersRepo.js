import db from "../connect.js";

const findByUsername = async (username) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0] || null;
};

const updateRefreshToken = async (userId, refreshToken) => {
    await db.query(
        "UPDATE users SET refresh_token = ? WHERE id = ?",
        [refreshToken, userId]
    );
};

export default {
    findByUsername,
    updateRefreshToken
};
