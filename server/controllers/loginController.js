const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = {
  signup: function(req, res) {
    let email = req.body.email;
    let salt = bcrypt.genSaltSync(7);
    let hash = bcrypt.hashSync(req.body.password, salt);
    let userInfo = {
      email,
      password: hash,
      name: req.body.name
    };
    user.create(userInfo, (err, newUser) => {
      if (err) {
        res.status(400).json({ err });
        return console.log(err);
      }
      let userId = newUser._id
      let token = jwt.sign({ userId }, process.env.SECRET_KEY);
      res.status(201).json({
        msg: "successfully create new user",
        token
      });
    });
  },
  signin: function(req, res) {
    let userId = req.body.userId;
    let token = jwt.sign({ userId }, process.env.SECRET_KEY);
    res.status(200).json({
      message: "successfully sign in",
      token
    });
  }
};
