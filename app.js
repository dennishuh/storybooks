const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

require('./config/passport')(passport);

const auth = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('It works');
});

app.use('/auth', auth);

app.listen(PORT, () => {
  console.log('App started on port: ' + PORT);
})
