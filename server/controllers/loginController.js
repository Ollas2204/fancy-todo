const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = {
  signup: function(req, res) {
    let salt = bcrypt.genSaltSync(7);
    let hash = bcrypt.hashSync(req.body.password, salt);
    let userInfo = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      role: req.body.role
    };
    user.create(userInfo, (err, newUser) => {
      if (err) {
        res.status(400).json({ err });
        return console.log(err);
      }
      res.status(201).json({
        msg: "successfully create new user",
        newUser
      });
    });
  },
  signin: function(req, res) {
    let username = req.body.username;
    let role = req.body.role;
    let id = req.body.id;
    let token = jwt.sign({ username, role, id }, process.env.SECRET_KEY);
    res.status(200).json({
      message: "successfully sign in",
      token
    });
  }
};
