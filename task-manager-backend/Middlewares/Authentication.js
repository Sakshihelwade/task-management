const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res
        .status(401)
        .send({ error: "Unauthorized", msg: "Please login" });
    }

    jwt.verify(accessToken, "task_management", async (err, decode) => {
      if (decode) {
        req.user = decode.user;
        next();
      } else {
        res
          .status(401)
          .send({ error: "Unauthorized", msg: "Please login first." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  authentication,
};
