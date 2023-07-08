const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose')

const student = require('./handleStudent');
const fee = require('./handleFee');

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DBUID}:${process.env.DBPASS}@wisdomcluster.l40bgon.mongodb.net/wisdomdb`;

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

app.get('/fetchStudents', student.handleFetch);
app.post('/addStudent', student.handleAdd);
app.get('/enableStudent/:studentId', student.handleEnable);
app.get('/disableStudent/:studentId', student.handleDisable);
app.get('/promoteStudent/:studentId', student.handlePromotion);
app.delete('/delStudent/:studentId', student.handleDel);

app.get('/fetchPendingFee', fee.handleFetchPending);
app.get('/fetchFee/:studentId', fee.handleFetch);
app.post('/addFee/:studentId', fee.handleAdd);
app.post('/delFee/:studentId', fee.handleDel);

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