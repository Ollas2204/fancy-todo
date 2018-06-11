require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/todo-fancy");

app.use("/", indexRouter);
app.use("/user", userRouter);


app.listen(3000, () => {
  console.log("listeing in port 3000");
});
