const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = {
  signup: function(req, res) {
    let hash = "";
    let email = req.body.email;
    if (req.body.password !== "") {
      let salt = bcrypt.genSaltSync(7);
      hash = bcrypt.hashSync(req.body.password, salt);
    }
    let userInfo = {
      email,
      password: hash,
      name: req.body.name
    };
    user.findOne({ email }).then(found => {
      if (found) {
        res.send({ err: { message: "email is used" } });
      } else {
        user
          .create(userInfo)
          .then(newUser => {
            let userId = newUser._id;
            let name = newUser.name;
            let token = jwt.sign({ userId }, process.env.SECRET_KEY);
            res.status(201).json({
              msg: "successfully create new user",
              token,
              name
            });
          })
          .catch(err => {
            res.send(err.errors);
          });
      }
    });
  },
  signin: function(req, res) {
    let userId = req.body.userId;
    let name = req.body.name;
    let token = jwt.sign({ userId }, process.env.SECRET_KEY);
    res.status(200).json({
      message: "successfully sign in",
      token,
      name
    });
  },
  fbLogin: function(req, res) {
    user
      .findOne({ email: req.body.email })
      .then(result => {
        if (result) {
          let userId = result._id;
          let name = result.name;
          let token = jwt.sign({ userId }, process.env.SECRET_KEY);
          res.status(201).json({
            msg: "fb login successful",
            token,
            name
          });
        } else {
          let salt = bcrypt.genSaltSync(7);
          let hash = bcrypt.hashSync(req.body.password, salt);
          user
            .create({
              name: req.body.name,
              email: req.body.email,
              password: hash
            })
            .then(newUser => {
              let userId = newUser._id;
              let name = newUser.name;
              let token = jwt.sign({ userId }, process.env.SECRET_KEY);
              res.status(201).json({
                msg: "add new user",
                token,
                name
              });
            });
        }
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });
  }
};
