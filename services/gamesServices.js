import gamesRepo from "../repositories/gamesRepo.js";
import db from "../connect.js";

const getAllGames = async () => {
    const rows = await gamesRepo.findAllGames();
    return rows;
}

const newGameService = async (title, genre, rating) => {
    const insertVal = [
        title,
        genre,
        rating
    ];
    const insertSql = "INSERT INTO games (title, genre, rating) VALUES (?, ?, ?)";
    await db.query(insertSql, insertVal);
}

const updateGameService = async (title, genre, rating, id) => {
    const updateSql = `UPDATE games
        SET
            title = COALESCE(?, title),
            genre = COALESCE(?, genre),
            rating = COALESCE(?, rating)
        WHERE id = ?
    `;
    const updateVal = [
        title,
        genre,
        rating,
        id
    ];
    const [result] = await db.query(updateSql, updateVal);

    if (result.affectedRows === 0) {
        const err = new Error("Game not found");
        err.code = "NOT_FOUND";
        throw err;
    }

}

const deleteGameService = async (id) => {
    const deleteSql = "DELETE FROM games WHERE id = ?";
    const deleteVal = [ id ];

    const [result] = await db.query(deleteSql, deleteVal);

    if (result.affectedRows === 0) {
        const err = new Error("Game not found");
        err.code = "NOT_FOUND";
        throw err;
    }
}

export default {
    getAllGames,
    newGameService,
    updateGameService,
    deleteGameService
}