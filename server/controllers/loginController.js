const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");
const fb = require("fb");

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
            let token = jwt.sign({ userId }, process.env.SECRET_KEY);
            res.status(201).json({
              msg: "successfully create new user",
              token
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
    let token = jwt.sign({ userId }, process.env.SECRET_KEY);
    res.status(200).json({
      message: "successfully sign in",
      token
    });
  },
  fbLogin: function(req, res) {
    let accessToken = req.headers.accesstoken;
    fb.api(
      "me",
      { fields: "id, name, email", access_token: accessToken },
      function(response) {
        user
          .findOne({ email: response.email })
          .then(result => {
            if (result) {
              let userId = result._id;
              let token = jwt.sign({ userId }, process.env.SECRET_KEY);
              res.status(201).json({
                msg: "logged in",
                result,
                token
              });
            } else {
              let salt = bcrypt.genSaltSync(7);
              let hash = bcrypt.hashSync("fbLogin", salt);
              user
                .create({
                  fbID: response.id,
                  name: response.name,
                  email: response.email,
                  password: hash
                })
                .then(newUser => {
                  let userId = newUser._id;
                  let token = jwt.sign({ userId }, process.env.SECRET_KEY);
                  res.status(201).json({
                    msg: "add new user",
                    newUser,
                    token
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
    );
  }
};
