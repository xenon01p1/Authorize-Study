import { validateRefreshToken } from "../utils/jwt.js";

export const checkAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message : "Unauthorize access." });

    const token = authHeader.split("")[1];
    try {
        const decoded = validateRefreshToken(token);
        req.user = decoded;
        next();
        
    } catch (err) {
        res.status(403).json({ message : "Invalid token." });
    }
}