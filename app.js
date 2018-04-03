const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => {
  res.send('It works');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('App started on port: ' + PORT);
})
