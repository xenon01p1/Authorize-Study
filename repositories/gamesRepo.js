import db from "../connect.js";

const findAllGames = async () => {
    const [rows] = await db.query("SELECT * FROM games");
    return rows;
}

const insertGame = async (data) => {
    const insertSql = "INSERT INTO games (title, genre, rating) VALUES (?, ?, ?)";
    const [result] = await db.query(insertSql, data);
    return result;
}

const updateGame = async (data) => {
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

const deleteGame = async (data) => {
    const deleteSql = "DELETE FROM games WHERE id = ?";
    const [result] = await db.query(deleteSql, data);
    return result;
}

export default {
    findAllGames,
    insertGame,
    updateGame,
    deleteGame
}