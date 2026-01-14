const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ ADD THIS LINE HERE
app.use('/uploads', express.static('uploads'));

global.parameters = {
  accessTokenSecret: "TEMP_ACCESS_TOKEN_SECRET_12345"
};


app.use(cors());
// Middleware
app.use(bodyParser.json());

// Import routes
// const authRoutes = require("./app/modules/auth/auth.routes");
// app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

require("./routes")(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

