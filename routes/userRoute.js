const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');

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


router.post('/', async (req, res) => {

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email FROM users WHERE email='${req.body.email}'`, async function (error, results, fields) {
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                break;
            }            
        }
        if (alreadyReg) {
            
            console.log("User already Registered .");
            res.status(400).send('User already Registered.');
        } else {
            const user = [req.body.userName, req.body.officeID, req.body.email, req.body.password, req.body.accountType];
            const salt = await bcrypt.genSalt(10);
            user[3] = await bcrypt.hash(user[3], salt); 
        
            connection.query("INSERT INTO users (userName,officeID,email,password,accountType)\
            VALUES (?,?,?,?,?)" , user, (error, results, fields) => {
            !error ? res.status(200).send("Successfully Added User " + user[0]) : res.json(error);
            });
        }

    });
});

function validateUser(user) {
    const schema = Joi.object({
        userName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        accountType: Joi.string().min(3).max(255).required()
        
    });
    return schema.validate(user);
}

module.exports = router;