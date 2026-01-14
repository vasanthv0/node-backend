const controller = require("./user.controller.js");
// const Auth = require("../../middleware/jwt.js");

module.exports = (app) => {
  
  app.get("/getuserbyhid/:hid/:bid", controller.getalluserbyid);//for user side


  app.get("/user-list", controller.list);
  app.post("/user-add",  controller.create);
  app.put("/user-edit/:userid", controller.update);
  app.get("/user-view/:userid", controller.view);
  // app.get("/user-select", Auth.validateToken, controller.select);
  // app.get("/user-select", Auth.validateToken, controller.select);
  app.delete("/user-delete/:id",  controller.remove);
};
