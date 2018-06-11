const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let todoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    action: {
      type: String,
      required: [true, "action is required"]
    },
    status: {
      type: String,
      default: "Not Finished"
    },
    tags: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("todos", todoSchema);
