import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 9002;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
const DB =
  "mongodb+srv://Pk90264180:288AWF%40Xr6B8nnV@cluster0.bjvhzte.mongodb.net/reactbyme?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    console.log("Connected to MONGOD !!");
  })
  .catch(function (err) {
    console.log("Failed to establish connection with MONGOD !!");
    console.log(err.message);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//Routes

app.get("/", (req, res) => {
  res.send("this is home page");
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now." });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
