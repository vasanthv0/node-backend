const pool = require("../../config/db");
const { nanoid } = require("nanoid");

const ContactModel = {};

ContactModel.create = async (contact) => {
  if (!contact.name || !contact.email || !contact.message) {
    throw new Error("Name, email and message are required fields");
  }

  const { name, email, message } = contact;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  try {
    return await pool.query(
      `INSERT INTO contact (name, email,message)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, message]
    );
  } catch (error) {
    throw new Error(`Failed to create contact: ${error.message}`);
  }
};

ContactModel.getAll = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM contact ORDER BY id DESC`
    );
    if (!result || !result.rows) {
      throw new Error('No results returned from database');
    }
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to retrieve contacts: ${error.message}`);
  }
};

module.exports = ContactModel;
