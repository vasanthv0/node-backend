const pool= require("../../config/db");
const { nanoid } = require("nanoid");

//const Models = function () {};

const userModel = {};


    userModel.AddUser = async (hid,bid,name, email, password, role) => {
    try {
      let user_id = nanoid(15);
      const sql =
        "INSERT INTO users (user_id, name, email, password, role,hotal_id,branch_id) VALUES ($1, $2, $3, $4, $5, $6, $7)";
      const result = await pool.query(sql, [
       user_id, name, email, password, role, hid,bid,
      ]);
      return {
        status: true,
        message: "User added successfully",
        id: result.rows.insertId,
      };
    } catch (err) {
      console.error("Insert Error:", err);
      return { status: false, message: "Database error" };
    }
  },
  userModel.checkEmailForAdd= async (email) => {
    try { 
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND status = $2",
        [email, "A"]
      );
      if (result.rows.length > 0) {
        return { status: false, message: "Email already exists" };
      }
      return { status: true };
    } catch (err) {
      console.error("Email check error:", err);
      return { status: false, message: "Database error" };
    }
  },
  userModel.checkEmailExist = async (email, id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND user_id != $2 AND status = $3",
        [email, id, "A"]
      );
      if (result.rows.length > 0) {
        return { status: false, message: "Email already exists" };
      }
      return { status: true };
    } catch (err) {
      console.error("Email check error:", err);
      return { status: false, message: "Database error" };
    }
  },
  userModel.getAllUsers = async (numPerPage, skip, where) => {
    try {
      const rows = await pool.query(
        `SELECT * FROM users WHERE status = $1 ${where} LIMIT $2 OFFSET $3`,
        ["A", numPerPage, skip]
      );
      const count = await pool.query(
        `SELECT COUNT(*) AS total_count FROM users WHERE status = $1 ${where}`,
        ["A"]
      );
      return { status: true, data: rows.rows, count: count.rows[0].total_count };
    } catch (err) {
      console.error(err);
      return { status: false, message: "Error fetching users" };
    }
  },  

userModel.getalluserbyid = async (limit, offset, user_id, hid, bid) => {
  try {
    let conditions = `status = $1 AND branch_id = $2 AND hotal_id = $3`;
    let values = ["A", bid, hid];

    if (user_id) {
      values.push(user_id);
      conditions += ` AND user_id = $${values.length}`;
    }

    const dataQuery = `
      SELECT *
      FROM users
      WHERE ${conditions}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const dataValues = [...values, limit, offset];

    const rows = await pool.query(dataQuery, dataValues);

    const countQuery = `
      SELECT COUNT(*) AS total_count
      FROM users
      WHERE ${conditions}
    `;

    const count = await pool.query(countQuery, values);

    return {
      status: true,
      data: rows.rows,
      count: parseInt(count.rows[0].total_count),
    };
  } catch (err) {
    console.error(err);
    return { status: false, message: "Error fetching users" };
  }
};


  userModel.getUsers = async () => {
    try {
      const rows = await pool.query(
        `SELECT user_id, name FROM users WHERE status = $1 LIMIT 300`,
        ["A"]
      );

      return { status: true, data: rows.rows };
    } catch (err) {
      console.error(err);
      return { status: false, message: "Error fetching users" };
    }
  },
  userModel.getUserView = async (id) => {
    try {
      const rows = await pool.query(
        `SELECT 
        u.user_id,
        u.name,
        u.email,
        u.password,
        u.role,
        u.hotal_id,
        u.branch_id,
        h.name AS hotal_name
        FROM users u
        JOIN hotal h ON u.hotal_id = h.hotal_id
        WHERE u.user_id = $1 AND u.status = 'A'`, [
        id,
      ]);
      if (rows.rows.length === 0) {
        return { status: false, message: "User not found" };
      }
      return { status: true, data: rows.rows[0] };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { status: false, message: "Database error" };
    }
  },
  userModel.updateUser = async (id, data) => {
    console.log(data);
    try {
      const result = await pool.query(
        `UPDATE users SET name=$1, email=$2, role=$3, password=$4 WHERE user_id=$5`,
        [data.name, data.email, data.role, data.password, id]
      );
      return { status: true, meassage: "User update successfully" };
    } catch (error) {
      console.error("Update error:", error);
      return { status: false, message: "Database error" };
    }
  },
 userModel.removeUser = async (user_id) => {
    try {
      const updateSql = `
      UPDATE users
      SET status = $1
      WHERE user_id = $2
    `;

      const updateResult = await pool.query(updateSql, ["D", user_id]);

      if (updateResult.affectedRows === 0) {
        return { status: false, message: "User not found" };
      }

      return {
        status: true,
        message: "User removed successfully",
      };
    } catch (err) {
      console.error("Update Error:", err);
      return { status: false, message: "Database error" };
    }
  },

module.exports = userModel;
