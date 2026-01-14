const validateToken = require("../../middleware/jwt.js");
const rbac = require("../../middleware/rbac.middleware.js");
const controller = require("./auth.controller.js");

module.exports = (app) => {
  app.post("/login", controller.login);
  
};
