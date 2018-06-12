const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { user, todo } = require("../models");

module.exports = {
  getTodos: function(req, res) {
    let params = { user: req.body.userId };
    if (req.query.tag) {
      params.tags = { $in: req.query.tag };
    }
    todo
      .find(params)
      .sort({ completed: 1, createdAt: -1 })
      .then(todos => {
        res.status(200).json({
          msg: "successfully get todo list",
          todos
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  },
  addTodo: function(req, res) {
    let userId = req.body.userId;
    let action = req.body.action;
    let tags = req.body.tags;
    todo
      .create({ user: userId, action, tags })
      .then(todo => {
        user
          .findByIdAndUpdate(
            userId,
            { $push: { todos: todo._id } },
            { new: true }
          )
          .then(affectedUser => {
            res.status(201).json({
              msg: "successfully add new action to do list",
              affectedUser,
              todo
            });
          });
      })
      .catch(err => {
        if (err) {
          res.status(400).send(err);
        }
      });
  },
  updateTodo: function(req, res) {
    let todoId = req.params.todoId;
    let updatedTodo = req.body;
    todo
      .findByIdAndUpdate(todoId, { $set: updatedTodo }, { new: true })
      .then(todo => {
        let addTags = req.body.addTags;
        let removeTags = req.body.removeTags;
        if (addTags[0] !== "") {
          for (let i = 0; i < addTags.length; i++) {
            let tag = addTags[i];
            todo.tags.push(tag);
          }
        }
        if (removeTags[0] !== "") {
          for (let i = 0; i < removeTags.length; i++) {
            let tag = removeTags[i];
            todo.tags.pull(tag);
          }
        }
        todo.save().then(todo => {
          res.status(200).json({
            msg: "successfully update todo",
            todo
          });
        });
      })
      .catch(err => {
        if (err) {
          res.send(err);
        }
      });
  },
  deleteTodo: function(req, res) {
    let todoId = req.params.todoId;
    todo
      .findByIdAndRemove(todoId)
      .then(todo => {
        res.status(200).json({
          msg: "successfully remove to do from list",
          todo
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  },
  addTag: function(req, res) {
    let user = req.params.userId;
    let todoId = req.params.todoId;
    let newTag = req.body.tag;
    todo
      .findByIdAndUpdate(todoId, { $push: { tags: newTag } }, { new: true })
      .then(todo => {
        res.status(200).json({
          msg: "successfully add new tag to todo",
          todo
        });
      })
      .catch(err => {
        if (err) {
          res.status(400).json(err);
        }
      });
  }
};
