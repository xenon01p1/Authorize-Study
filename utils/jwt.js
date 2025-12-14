import jwt from "jsonwebtoken";

const ACCESS_SECRET = "YouDUmbass";
const REFRESH_SECRET = "I'm Suicidal";

export const createAccessToken = (userId) => {
    return jwt.sign({id: userId}, ACCESS_SECRET, { expiresIn: "5m" });
}

export const createRefreshToken = (userId) => {
    return jwt.sign({id: userId}, REFRESH_SECRET, { expiresIn: "5m" });
}

export const validateAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
}

export const validateRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
}