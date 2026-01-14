const Model = require("./user.model");

exports.list = async (req, res) => {
  try {
    let numPerPage = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * numPerPage;

    let user_id = req.query.user_id;
    let where = [];

    user_id && where.push(`AND user_id = '${user_id}'`);

    const result = await Model.getAllUsers(numPerPage, skip, where);

    if (result.status) {
      // res.json(result.data);
      res.json({
        status: true,
        result: result.data,
        totalCount: result.count,
      });
    }
  } catch (error) {
    res.status(500).json({ message: result.message });
  }
};

exports.getalluserbyid = async (req, res) => {
  try {
    const numPerPage = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * numPerPage;

    const { hid, bid } = req.params;
    const user_id = req.query.user_id;

    const result = await Model.getalluserbyid(
      numPerPage,
      skip,
      user_id,
      hid,
      bid
    );

    if (result.status) {
      res.json({
        status: true,
        result: result.data,
        totalCount: result.count,
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { hid,bid,name, email, password, role } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .send({ status: false, message: "All fields required" });
    }

    let checkExistingEmail = await Model.checkEmailForAdd(email);
    if (checkExistingEmail.status == false) {
      res.send(checkExistingEmail);
      return;
    }

    const result = await Model.AddUser(hid,bid,name, email, password, role);
    res.send(result);
  } catch (error) {}
};
exports.update = async (req, res) => {
  try {
    const id = req.params.userid;
    const data = req.body;

    let checkEmail = await Model.checkEmailExist(data.email, id);

    if (!checkEmail.status) {
      res.send(checkEmail);
      return;
    }

    const result = await Model.updateUser(id, data);

    if (result.status) {
      res.json({ status: true, data: result.data });
    } else {
      res.status(404).json({ status: false, message: result.message });
    }
  } catch (error) {}
};
exports.select = async (req, res) => {
  try {
    const result = await Model.getUsers();

    if (result.status) {
      // res.json(result.data);
      res.json({
        status: true,
        result: result.data,
      });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {}
};
exports.remove = async (req, res) => {
  try {
    const user_id = req.params.id;

    const result = await Model.removeUser(user_id);

    if (result.status) {
      res.json({ status: true, message: result.message });
    } else {
      res.status(404).json({ status: false, message: result.message });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
exports.view = async (req, res) => {
  try {
    const id = req.params.userid;
    // console.log(id);
    
    const result = await Model.getUserView(id);

    if (result.status) {
      res.json({ status: true, data: result.data });
    } else {
      res.status(404).json({ status: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: result.message });
  }
};
