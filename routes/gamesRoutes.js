import express from "express";
import { getGames, newGames, updateGames, deleteGames } from "../controllers/gamesController.js";
import { checkAuthMiddleware } from "../middlewares/authMiddleware.js";

const gamesRoute = express.Router();

gamesRoute.get("/list-games", checkAuthMiddleware, getGames);
gamesRoute.post("/list-games", checkAuthMiddleware, newGames);
gamesRoute.patch("/list-games/:id", checkAuthMiddleware, updateGames);
gamesRoute.delete("/list-games/:id", checkAuthMiddleware, deleteGames);

export default gamesRoute;