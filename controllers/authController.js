import { createAccessToken, createRefreshToken, validateRefreshToken } from "../utils/jwt.js";
import { loginSchema, registerSchema, refreshTokenSchema } from "../schemas/authSchema.js";
import authService from "../services/authServices.js";

export const login = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const tokens = await authService.login(value);
        return res.status(200).json({
            message: "Login successful",
            ...tokens
        });
    } catch (err) {
        if (err.message === "INVALID_CREDENTIALS") {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const register = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        await authService.register(value.username, value.password);

        return res.status(201).json({
            message: "Register successful. Please log in with your new account.",
        });

    } catch (err) {
        // MySQL duplicate entry error code
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Username already exists."
            });
        }

        return res.status(500).json({
            message: err.message
        });
    }
};

// note : refresh token doesn't need permission 
// because it's for refresh token doesn't need permission
export const refreshToken = async (req, res) => {
    const { error, value } = refreshTokenSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    // validate token
    let payload;
    try {
        payload = validateRefreshToken(value.refreshToken);
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token." })
    }

    try {
        const newToken = await authService.refreshToken({ 
            id: payload.id, 
            refresh_token: value.refreshToken
        });

        return res.status(201).json({  
            message: "Refresh token successful!",
            ...newToken
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


}