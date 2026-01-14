const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Model = require("./auth.model.js");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username);
    // console.log(password);
    
    const result = await Model.LoginUserCheck(username, password);
    console.log(result);
    if (!result.status) return res.status(401).json(result);

    const payload = {
      uId: result.data.userid,
      role: result.data.role,
      hotelId: result.data.hotel_id,
      branch: result.data.branch_id,
      permissions: result.data.permissions || [],
    };
    console.log("eee",payload);

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await Model.saveRefreshToken(result.data.userid, refreshToken);

    res.json({
      status: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      uId: payload.uId,
      role: payload.role,
      hotelId: payload.hotelId,
      branch: payload.branch,
      permissions: payload.permissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const stored = await Model.findRefreshToken(refreshToken);
    if (!stored)
      return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      {
        uId: decoded.uId,
        role: decoded.role,
        hotelId: decoded.hotelId,
        permissions: decoded.permissions,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await Model.invalidateRefreshToken(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  // req.decoded is set by your JWT middleware
  const hotelId = req.decoded.hotelId;
  res.json({ message: `Bookings for hotel ${hotelId}`, user: req.decoded });
};

exports.getAllUsers = async (req, res) => {
  res.json({ message: "List of all users (Admin only)", user: req.decoded });
};
