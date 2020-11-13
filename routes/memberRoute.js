const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const generateUniqueId = require('generate-unique-id');
// const {addPersonal,addResAddress} = require('../queries/memberRegisterQueries')

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

    else console.log("Database connection failed" , send.stringify(err));   
});

let memberFirstName = '';

router.post('/', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the member available
    
    const personalData = req.body.personalData;
    const officialData = req.body.officialData;
    const professionalData = req.body.professionalData;
    const membershipData = req.body.membershipData;
    const paymentData = req.body.paymentData;

    const id = generateUniqueId({
        useLetters: false,
        length: 8
    });

    connection.query(`SELECT email FROM member_personal WHERE email='${personalData.email}'`, async function (error, results, fields) {
        let databaseError;
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        for(i=0; i<results.length; i++) {
            if(personalData.email == results[i].email) {
                alreadyReg = true;
                break;
            }            
        }
        if (alreadyReg) {
            console.log("Member already Registered.");
            res.status(400).send('Member already Registered.');
            return;
        } 
        else addResAddress(personalData,res,id,officialData) 
    });   
});


function addPersonal(personalData,res,id,officialData) {
    const personal = [id, personalData.title, personalData.nameWinitials, personalData.nameInFull, personalData.firstName, personalData.lastName, 
    personalData.gender, personalData.dob, personalData.nic,  personalData.mobileNo, personalData.landNo, personalData.email, id];
        
    memberFirstName = personal[4]

    connection.query(`INSERT INTO member_personal (personalID, title,nameWinitials,fullName,commonFirst,commomLast,gender,dob,nic,mobileNo,fixedNo,email,resAddrsID)\
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,(SELECT resAddrsID FROM member_res_addresses WHERE resAddrsID=${id}))` , personal, (error, results, fields) => {
        // (error) ? res.status(404).send(error) : addResAddress()
            // if(error) databaseError = error;
         if(error) return res.status(404).send(error)
        addOfficeAddress(res,id,officialData)
        // console.log(id)
            
    });
};

function addResAddress(personalData,res,id,officialData) {
    const personalResAddrs = [id, personalData.resAddOne, personalData.resAddTwo , personalData.resAddThree, personalData.resAddFour, 
    personalData.resAddFive];
    connection.query("INSERT INTO member_res_addresses (resAddrsID, lineOne,lineTwo,lineThree,lineFour,lineFive)\
    VALUES (?,?,?,?,?,?)" , personalResAddrs, (error, results, fields) => {
        if(error) return res.status(404).send(error)
        addPerAddress(personalData,res,id,officialData)
        
        // if(error) databaseError = error;

    });
};

function addPerAddress(personalData,res,id,officialData) {
    const personalPerAddrs = [id, personalData.perAddOne, personalData.perAddTwo , personalData.perAddThree, personalData.perAddFour, 
    personalData.perAddFive];
    connection.query("INSERT INTO member_per_address (perAddrsID, lineOne,lineTwo,lineThree,lineFour,lineFive)\
    VALUES (?,?,?,?,?,?)" , personalPerAddrs, (error, results, fields) => {
        if(error) return res.status(404).send(error)
        addPersonal(personalData,res,id,officialData)
        
        // if(error) databaseError = error;

    });
};

function addOfficial(res,id,officialData) {
    const official = [id, officialData.designation, officialData.division , officialData.placeWork, officialData.offMobile, 
    officialData.offLandNo, officialData.offFax, officialData.offEmail, id];

    connection.query(`INSERT INTO member_official (officialID, designation,department,placeOfWork,offMobile,offLand,\
        offFax,offEmail,offAddrsID)\
    VALUES (?,?,?,?,?,?,?,?,(SELECT offAddrsID FROM member_office_addrs WHERE offAddrsID=${id}))` , official, (error, results, fields) => {
        
        (!error) ? res.status(200).send("Successfully Added Member " + memberFirstName) : res.status(404).send(error);
        
            
        // if(error) databaseError = error;
    
    });
}

function addOfficeAddress(res,id,officialData) {
    const officialAddrs = [id, officialData.offAddrslineOne, officialData.offAddrslineTwo , officialData.offAddrslineThree, officialData.offAddrslineFour, 
    officialData.offAddrslineFive];

    connection.query('INSERT INTO member_office_addrs (offAddrsID, lineOne,lineTwo,lineThree,lineFour,lineFive)\
        VALUES (?,?,?,?,?,?)' , officialAddrs, (error, results, fields) => {
        if(error) return res.status(404).send(error)
        addOfficial(res,id,officialData)
            
        // if(error) databaseError = error;
    
    });
}





// (!databaseError) ? res.status(200).send("Successfully Added Member " + personal[3]) : res.send(databaseError);
                // console.log(id)



// function validateMember(member) {
//     const schema = Joi.object({
//         userName: Joi.string().min(5).max(50).required(),
//         officeID: Joi.string().min(5).max(255),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(5).max(255).required(),
//         accountType: Joi.string().min(3).max(255).required()
        
//     });
//     return schema.validate(member);
// }

module.exports = router;