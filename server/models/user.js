const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, "username is used"],
      required: [true, "username is required"]
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    firstName: String,
    lastName: String,
    role: {
      type: String,
      enum: ["admin", "user"]
    },
    todos: [{
      type: Schema.Types.ObjectId,
      ref: "todos"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
