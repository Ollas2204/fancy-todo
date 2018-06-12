const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "username is required"]
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    name: String,
    fbID: String,
    todos: [{
      type: Schema.Types.ObjectId,
      ref: "todos"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
