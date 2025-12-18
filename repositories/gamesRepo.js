import db from "../connect.js";

export const findAllGames = async () => {
    const [rows] = await db.query("SELECT * FROM games");
    return rows;
}

export const insertGame = async (data) => {
    const insertSql = "INSERT INTO games (title, genre, rating) VALUES (?, ?, ?)";
    const [result] = await db.query(insertSql, data);
    return result;
}

export const updateGame = async (data) => {
    const updateSql = `
        UPDATE games
        SET
            title = COALESCE(?, title),
            genre = COALESCE(?, genre),
            rating = COALESCE(?, rating)
        WHERE id = ?
    `;
    const [result] = await db.query(updateSql, data);
    return result;
}

export const deleteGame = async (data) => {
    const deleteSql = "DELETE FROM games WHERE id = ?";
    const [result] = await db.query(deleteSql, data);
    return result;
}