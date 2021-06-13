const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const env = require('../envVariables')

const router = express.Router();
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});
   
  connection.connect((err) => {
      if(!err) return console.log("Successfully connected to MySql database");
  
      else console.log("Database connection failed" , JSON.stringify(err));

      
  });


router.post('/applicant', async (req, res) => {

    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email,password,type,username, applicantID FROM applicants WHERE email='${req.body.email}'`, async function (error, results, fields) {
        console.log("results", results)
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        let passwordCorrect = false;
        let username = '';
        let type = '';
        let applicant = ''
        // console.log(results)
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                passwordCorrect = await bcrypt.compare(req.body.password, results[i].password);
                if(passwordCorrect){
                    
                    username = results[i].username;
                    type = results[i].type;
                    applicant = results[i].applicantID
                }
                break;
            }            
        }
        if (!alreadyReg) {
            
            console.log("User haven't Registered .");
            res.status(400).json({
                msg: "User haven't Registered"
            });
        } 
        else if(!passwordCorrect) {
            console.log("Password is incorrect .");
            res.status(400).json({
                msg: 'Password is incorrect.'
            })
        }
        else {
            console.log(`${username} , ${type}`)

            const token = jwt.sign({id : applicant, username: username, type: type}, env.jewtKey)
            res.status(200).header('x-auth-token', token).json({
                jwt: token,
                msg: 'Logged In Successfully',
                type: 'Applicant'
            })
            // res.status(200).json({
            //     data : {
            //         username: username,
            //         type: type,
            //         applicantID: applicant,
            //     },
            //     msg: "User Successfully Logged In"                

            // })
        }
        // else {
        //     const user = [req.body.userName, req.body.officeID, req.body.email, req.body.password, req.body.accountType];
        //     const salt = await bcrypt.genSalt(10);
        //     user[3] = await bcrypt.hash(user[3], salt); 
        
        //     connection.query("INSERT INTO users (userName,officeID,email,password,accountType)\
        //     VALUES (?,?,?,?,?)" , user, (error, results, fields) => {
        //     !error ? res.status(200).send("Successfully Added User " + user[0]) : res.json(error);
        //     });
        // }

    });
});

function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        type: Joi.string().min(3).max(255).required()
        
    });
    return schema.validate(user);
}

module.exports = router;