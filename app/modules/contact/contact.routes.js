const contactController = require("./contact.controller");
// const Auth = require("../../middleware/jwt.js");

module.exports = (app) => {
  
 


  app.post("/messageadd", contactController.createContact);
  app.get("/api/contact", contactController.getContacts); // for admin view
};