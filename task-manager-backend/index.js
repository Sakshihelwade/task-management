const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { userRoute } = require("./Routes/UserRoute");
const { TaskRouter } = require("./Routes/TaskRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

//initial api
app.get("/", async (req, res) => {
  res.send("working");
});

// user api's
app.use("/api", userRoute);

//task api's

app.use("/api", TaskRouter);

app.listen(9090, async () => {
  try {
    await connection;
    console.log("connection established");
    console.log("Listening on port", 9090);
  } catch (error) {
    console.log(error);
  }
});
