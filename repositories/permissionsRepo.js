import db from "../connect.js";

const findPermissionsByUserId = async (userId) => {
    const [rows] = await db.query(
        `
        SELECT DISTINCT p.name
        FROM users_roles ur
        JOIN role_permissions rp ON rp.role_id = ur.role_id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = ?
        `,
        [userId]
    );

    return rows.map(row => row.name);
};

export default { findPermissionsByUserId };
