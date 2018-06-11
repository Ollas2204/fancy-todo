const { user } = require("../models");
const bcrypt = require("bcrypt");

module.exports = function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  user
    .findOne({ username })
    .then(user => {
      if (user) {
        let isPasswordTrue = bcrypt.compareSync(password, user.password);
        if (isPasswordTrue) {
          req.body.username = user.username;
          req.body.role = user.role;
          req.body.id = user._id;
          next();
        }
      }
      res.status(400).json({
        message: "username / password wrong"
      });
    })
    .catch(err => {
      if (err) {
        res.status(400).json({ err });
      }
    });
};
