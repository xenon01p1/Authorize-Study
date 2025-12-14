import bcrypt from "bcrypt";
import db from "../connect.js";
import { createAccessToken, createRefreshToken, validateRefreshToken } from "../utils/jwt.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username) return res.status(400).json({ message: "Username is undefined." });
    if (!password) return res.status(400).json({ message: "Password is undefined." });

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [ username ]);
        const user = rows[0];

        const match = bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);
        const updateVal = [ refreshToken, user.id ];

        await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", updateVal);

        return res
            .status(200)
            .json({
                message: "Login successfull",
                accessToken,
                refreshToken,
                role: user.role_id
            });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

export const register = async (req, res) => {
    try {
        const { roleId, username, password } = req.body;

        if (!roleId) return res.status(400).json({ message: "Role ID is undefined." });
        if (!username) return res.status(400).json({ message: "Username is undefined." });
        if (!password) return res.status(400).json({ message: "Password is undefined." });

        const hashedPass = await bcrypt.hash(password, 12);

        const sql = "INSERT INTO users (role_id, username, password) VALUES (?, ?, ?)";
        const insertVal = [roleId, username, hashedPass];

        await db.query(sql, insertVal);

        return res.status(200).json({
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

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token is undefined." });

    // validate token
    let payload;
    try {
        payload = validateRefreshToken(refreshToken);
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token." })
    }

    try {
        const selectVal = [ payload.id, refreshToken];
        const selectSql = "SELECT * FROM users WHERE id = ? AND refresh_token";
        const [rows] = await db.query(selectSql, selectVal);

        // generate new token
        const newAccessToken = createAccessToken(payload.id);
        const newRefreshToken = createAccessToken(payload.id);

        // update user to have new token
        const updateSql = "UPDATE users SET refresh_token = ? WHERE id = ?";
        const updateVal = [ newRefreshToken, payload.id ];
        await db.query( updateSql, updateVal);

        return res.status(201).json({  
            message: "Refresh token successful!",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


}