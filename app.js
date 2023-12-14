//libraries import
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// mongoDB database link
mongoose.connect('mongodb://localhost:27017/apif1light');

app.use(express.urlencoded());
app.use(express.json());

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});