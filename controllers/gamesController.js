import db from "../connect.js";
import { newGameSchema, updateGameSchema } from "../schemas/gamesSchema.js";

export const getGames = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM games");
        return res.status(200).json({ message: "Fetching data successful!", data: rows });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export const newGames = async (req, res) => {
    const { error, value } = newGameSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const insertVal = [
            value.title,
            value.genre,
            value.rating
        ];
        const insertSql = "INSERT INTO games (title, genre, rating) VALUES (?, ?, ?)";
        await db.query(insertSql, insertVal);

        return res
            .status(200)
            .json({
                message: "Insert games successful!"
            });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const updateGames = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = updateGameSchema.validate(req.body);

        if (!id) return res.status(400).json({ message: "Parameter 'id' is not defined" });
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updateSql = `UPDATE games
            SET
                title = COALESCE(?, title),
                genre = COALESCE(?, genre),
                rating = COALESCE(?, rating)
            WHERE id = ?
        `;
        const updateVal = [
            value.title,
            value.genre,
            value.rating,
            id
        ];
        await db.query(updateSql, updateVal);

        return res.status(200).json({ message: "Update successful!" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const deleteGames = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(200).json({ message: "Parameter 'id' is not defined" });

        const deleteSql = "DELETE FROM games WHERE id = ?";
        const deleteVal = [ id ];

        await db.query(deleteSql, deleteVal);
        return res.status(200).json({ message: "Successfully deleted game!" });
        
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}