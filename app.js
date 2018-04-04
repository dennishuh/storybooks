const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const hbs = require('express-hbs');

const index = require("./routes/index");
const auth = require("./routes/auth");
const keys = require("./config/keys");

const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongoURI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(error => console.log(error));

const app = express();

app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials",
    defaultLayout: __dirname + "/views/layouts/main"
  })
);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

require("./config/passport")(passport);

app.use(session({
  secret: 'secret',
  resave: false,
  saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", index);
app.use("/auth", auth);

app.listen(PORT, () => {
  console.log("App started on port: " + PORT);
});
