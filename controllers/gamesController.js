import db from "../connect.js";
import { newGameSchema, updateGameSchema } from "../schemas/gamesSchema.js";
import gamesServices from "../services/gamesServices.js";

export const getGames = async (req, res) => {
    try {
        const data = await gamesServices.getAllGames();
        return res.status(200).json({ message: "Fetching data successful!", data });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export const newGames = async (req, res) => {
    const { error, value } = newGameSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        
        await gamesServices.newGameService(value.title, value.genre, value.rating);

        return res
            .status(201)
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
        
        await gamesServices.updateGameService(value.title, value.genre, value.rating, id);

        return res.status(200).json({ message: "Update successful!" });

    } catch (err) {
        if (err.code === "NOT_FOUND") {
            return res.status(404).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }
}

export const deleteGames = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Parameter 'id' is not defined" });

        await gamesServices.deleteGameService(id);

        return res.status(200).json({ message: "Successfully deleted game!" });
        
    } catch (err) {
        if (err.code === "NOT_FOUND") {
            return res.status(404).json({ message: err.message });
        }
        
        return res.status(500).json({ message: err.message })
    }
}