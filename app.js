const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

// Mongoose connect:
main().catch((err) =>
  console.log("There was an error connecting to Mongo:", err)
);

async function main() {
  // * Removed useCreateIndex and useFindAndModify bc it wasn't supported
  await mongoose.connect("mongodb://localhost:27017/wikikids", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Mongo connection open!");
}

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("home");
});

app.get('/register', (req, res) => {
  res.render("users/register")
})

app.get('/login', (req, res) => {
  res.render("users/login")
})

app.get('/search', (req, res) => {
  res.render('search/index')
})

app.listen(3000, () => {
  console.log("Serving WikiKids on port 3000");
});
