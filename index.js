const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const student = require('./handleStudent');
const fee = require('./handleFee');
const { handleLogin, handleReg } = require('./handleLogin');

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DBUID}:${process.env.DBPASS}@${process.env.DB}/wisdomdb`;

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

const isAuthenitcated = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({"msg" : "A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({"msg": "Invalid Token"});
  }
  return next();
};


app.post('/login', handleLogin);
// app.post('/reg', handleReg);
app.get('/fetchStudents', isAuthenitcated, student.handleFetch);
app.post('/addStudent', isAuthenitcated, student.handleAdd);
app.get('/enableStudent/:studentId', isAuthenitcated, student.handleEnable);
app.get('/disableStudent/:studentId', isAuthenitcated, student.handleDisable);
app.get('/promoteStudent/:studentId', isAuthenitcated, student.handlePromotion);
app.delete('/delStudent/:studentId', isAuthenitcated, student.handleDel);
app.get('/fetchPendingFee', isAuthenitcated, fee.handleFetchPending);
app.get('/fetchFee/:studentId', isAuthenitcated, fee.handleFetch);
app.post('/addFee/:studentId', isAuthenitcated, fee.handleAdd);
app.post('/delFee/:studentId', isAuthenitcated, fee.handleDel);

// )

dbconnect();

function listen() {
    app.listen(process.env.PORT, ()=>{
        console.log("backend server running")
    })
}   


function dbconnect() {
    mongoose.connection
      .on('error', console.log)
      .on('disconnected', dbconnect)
      .once('open', listen);
    return mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
