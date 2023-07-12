
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const Admin = require('./models/AdminSchema')
require('dotenv').config()


const handleLogin = async (req, res)=>{
    if(req.body.username && req.body.password){
        try {
            const admin = await Admin.findOne({username : req.body.username})
            if(admin){
                if(await bcrypt.compare(req.body.password, admin.password)){
                    const token = jwt.sign(
                        { username : req.body.username },
                        process.env.TOKEN_KEY,
                        {
                          expiresIn: "1h",
                        }
                      );
                      // save user token
                    admin.token = token;
                    return res.status(200).json(admin);
                }
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }
    return res.status(400).send("Invalid inputs")
}

const handleReg = async (req , res)=>{
    if(req.body.username && req.body.pass){
        try {
            const hashedPass = await bcrypt.hash(req.body.pass, 10)
            const gentoken = await jwt.sign(
                { username : req.body.username },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );

              console.log(gentoken)
            const newAdmin = new Admin({
                username : req.body.username,
                password : hashedPass,
                token : gentoken
            })
            await newAdmin.save();
            return res.status(201).send("New admin created")
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }else{
        return res.status(400).send("Invalid inputs")
    }
    
}

module.exports = {handleLogin, handleReg}