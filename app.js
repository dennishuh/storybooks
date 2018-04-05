const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const hbs = require('express-hbs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const keys = require("./config/keys");
const index = require("./routes/index");
const stories = require("./routes/stories");
const auth = require("./routes/auth");

const hbsHelpers = require('./helpers/hbs');

const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongoURI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(error => console.log(error));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(methodOverride('_method'));

hbs.registerHelper('truncate', hbsHelpers.truncate);
hbs.registerHelper('stripTags', hbsHelpers.stripTags);
hbs.registerHelper('formatDate', hbsHelpers.formatDate);
hbs.registerHelper('select', hbsHelpers.select);
hbs.registerHelper('editIcon', hbsHelpers.editIcon);

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
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

app.listen(PORT, () => {
  console.log("App started on port: " + PORT);
});
