const express = require('express');

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

router.get('/:id', async (req, res) => {

    console.log(req.params.id)
    const profileID = req.params.id

    // title, nameWinitials, commonFirst, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs, gradeOfMembership, section, enrollDate, 
    // councilPosition, memberFolioNo, membershipNo, designation, department, placeOfWork, offMobile, offLand, offFax, offEmail, offAddrs, profession, 
    // specialization1, specialization2, specialization3, specialization4, specialization5, degree, university

    connection.query(`SELECT * FROM 
    members , member_academic
    WHERE 
    members.memberID = member_academic.memberID
    AND
    (members.nic = "${profileID}" OR members.membershipNo = "${profileID}");`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0]);
        res.status(200).send(results[0]);

    });
});

module.exports = router;