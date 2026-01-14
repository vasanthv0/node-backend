const pool = require("../../config/db"); 
const bcrypt = require("bcrypt");

const authModel = {}
  authModel.LoginUserCheck = async (username, password) => {
    // console.log(username, password);
    try {
      if (!username || !password) {
        return { status: false, message: "Invalid credentials" };
      }

      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND status = 'A'",
        [username]
      );

      if (result.rows.length === 0) {
        return { status: false, message: "Invalid credentials" };
      }

      const user = result.rows[0];

      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //   return { status: false, message: "Invlid credentials" };
      // }

      return {
        status: true,
        data: {
          userid: user.user_id,
          username: user.name,
          role: user.role,
          hotel_id: user.hotal_id, 
          branch_id: user.branch_id,
          permissions: user.permissions ? user.permissions.split(", ") : [],
  
          // permissions: user.permissions ? user.permissions.split(",") : [], 
        },
      };
    } catch (err) {
      console.error(err);
      return { status: false, message: "Database error" };
    }
  },

  authModel.saveRefreshToken = async (userId, token) => {
    try {
      await pool.query(
        "INSERT INTO refresh_tokens (user_id, token, status) VALUES ($1, $2, 'A')",
        [userId, token]
      );
    } catch (err) {
      console.error(err);
    }
  },

  authModel.findRefreshToken = async (token) => {
    try {
      const result = await pool.query(
        "SELECT * FROM refresh_tokens WHERE token = $1 AND status = 'A'",
        [token]
      );
      return result.rows[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  authModel.invalidateRefreshToken = async (token) => {
    try {
      await pool.query(
        "UPDATE refresh_tokens SET status = 'I' WHERE token = $1",
        [token]
      );
    } catch (err) {
      console.error(err);
    }
  },
module.exports = authModel;
