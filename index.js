const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const student = require('./handleStudent');
const fee = require('./handleFee');

require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

app.get('/fetchStudents', student.handleFetch);
app.post('/addStudent', student.handleAdd);
app.get('/fetchFee/:studentId', fee.handleFetch)
app.post('/addFee/:studentId', fee.handleAdd);

// )

app.listen(process.env.PORT, ()=>{
    console.log("backend server running")
})
