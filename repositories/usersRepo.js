import db from "../connect.js";

const ALLOWED_COLUMNS = [
  "id",
  "username",
  "password",
  "refresh_token"
];

const findByUsername = async (username) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0] || null;
};

const findUser = async (filters = {}) => {
  const keys = Object.keys(filters).filter(key =>
    ALLOWED_COLUMNS.includes(key)
  );

  if (keys.length === 0) {
    throw new Error("No valid filter provided");
  }

  const whereClause = keys
    .map(key => `${key} = ?`)
    .join(" AND ");

  const values = keys.map(key => filters[key]);

  const [rows] = await db.query(
    `SELECT * FROM users WHERE ${whereClause}`,
    values
  );

  return rows;
};


const updateRefreshToken = async (userId, refreshToken) => {
    await db.query(
        "UPDATE users SET refresh_token = ? WHERE id = ?",
        [refreshToken, userId]
    );
};

const insertUser = async (username, hashedPass) => {
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    const insertVal = [
        username, 
        hashedPass
    ];

    await db.query(sql, insertVal);
}

export default {
    findByUsername,
    updateRefreshToken,
    insertUser,
    findUser
};
