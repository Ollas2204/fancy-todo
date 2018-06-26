require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const { DB_USER, DB_PASS } = process.env;

const url = `mongodb://${DB_USER}:${DB_PASS}@ds153380.mlab.com:53380/fancy-todo`;

mongoose.connect(url).then(()=> {
  console.log('connected to db')
});

app.use("/", indexRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("listening in port 3000");
});
