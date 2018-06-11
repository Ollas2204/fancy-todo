const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = function(req, res, next) {
  let token = req.headers.token;
  let decoded = jwt.verify(token, process.env.SECRET_KEY);
  if (req.params.userId === decoded.id) {
    next();
  } else {
    res.status(403).json({
      message: 'you don\'t have access'
    });
  }
};
