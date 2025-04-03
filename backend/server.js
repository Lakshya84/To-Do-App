const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const conn = require("./conn/conn");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

conn()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const auth = require("./routes/auth");
const todoRoutes = require("./routes/todo");

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/todos", todoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
