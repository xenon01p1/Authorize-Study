import bcrypt from "bcrypt";
import usersRepo from "../repositories/usersRepo.js";
import permissionsRepo from "../repositories/permissionsRepo.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";

const login = async ({ username, password }) => {
    // 1. Find user
    const user = await usersRepo.findByUsername(username);
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Fetch permissions
    const permissions = await permissionsRepo.findPermissionsByUserId(user.id);

    // 4. Generate tokens
    const accessToken = createAccessToken(user.id, permissions);
    const refreshToken = createRefreshToken(user.id);

    // 5. Store refresh token
    await usersRepo.updateRefreshToken(user.id, refreshToken);

    // 6. Return result
    return {
        accessToken,
        refreshToken
    };
};

const register = async ( username, password ) => {
    const hashedPass = await bcrypt.hash(password, 12);
    await usersRepo.insertUser( username, hashedPass );
}

const refreshToken = async ({ id, refresh_token }) => {
    const users = await usersRepo.findUser({id, refresh_token});
    if (!users) throw new Error('INVALID_CREDENTIALS');

    const permissions = await permissionsRepo.findPermissionsByUserId(id);
    const newAccessToken = createAccessToken(id, permissions);
    const newRefreshToken = createRefreshToken(id);

    await usersRepo.updateRefreshToken(id, refresh_token);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}

export default { login, register, refreshToken };