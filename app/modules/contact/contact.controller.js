const ContactModel = require("./contact.model");

const { sendContactMail } = require("../../middleware/mailer");

exports.createContact = async (req, res) => {
  try {
    const { name, email, message,phone } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required"
      });
    }

    const result = await ContactModel.create({ name, email, message });

    // ✅ Send Email
    await sendContactMail({ name, email, message,phone  });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const result = await ContactModel.getAll();
    res.json({
      success: true,
      contacts: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
