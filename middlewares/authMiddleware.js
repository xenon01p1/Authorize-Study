import { validateAccessToken } from "../utils/jwt.js";

export const checkAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized access." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing." });
    }

    try {
        const decoded = validateAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
};
