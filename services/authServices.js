import bcrypt from "bcrypt";
import * as userRepo from "../repositories/usersRepo.js";
import * as permissionRepo from "../repositories/permissionsRepo.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";

const login = async ({ username, password }) => {
    // 1. Find user
    const user = await userRepo.findByUsername(username);
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Fetch permissions
    const permissions = await permissionRepo.findPermissionsByUserId(user.id);

    // 4. Generate tokens
    const accessToken = createAccessToken(user.id, permissions);
    const refreshToken = createRefreshToken(user.id);

    // 5. Store refresh token
    await userRepo.updateRefreshToken(user.id, refreshToken);

    // 6. Return result
    return {
        accessToken,
        refreshToken
    };
};

export default { login };