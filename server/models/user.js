const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const emailValidator = function(email) {
  return /^\w([.!#$%&’*+/=?^_`{|}~-]*?\w+)+@\w+(\.\w{2,3})+$/.test(email);
};


let userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [emailValidator, "not valid email format"]
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
