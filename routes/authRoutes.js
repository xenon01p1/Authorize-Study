import express from "express";
import { login, register, refreshToken } from "../controllers/authController.js";

const authController = express.Router();

authController.post('/login', login);
authController.post('/register', register);
authController.post('/refresh-token', refreshToken);

export default authController;
