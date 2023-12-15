//libraries import
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// mongoDB database link
mongoose.connect('mongodb://localhost:27017/apisecretsanta');

app.use(express.urlencoded());
app.use(express.json());

//Route pour les users
const userRoute = require('./routes/userRoute');
app.use('/users', userRoute);
//Route pour les users
const groupRoute = require('./routes/groupRoute');
app.use('/users', groupRoute);
//Route pour les users
const inviteRoute = require('./routes/inviteRoute');
app.use('/users', inviteRoute);
//Route pour les users
const membershipRoute = require('./routes/membershipRoute');
app.use('/users', membershipRoute);

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});