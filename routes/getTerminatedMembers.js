const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const DateDiff = require('date-diff');

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

router.get('/', async (req, res) => {

    connection.query(`SELECT 
    title, nameWinitials, status, dot, lastPaidForYear, lastMembershipPaid, arrearsConti, memPaidLast, nic, mobileNo, email, resAddrs, gradeOfMembership, section, enrollDate, 
    councilPosition, memberFolioNo, membershipNo
    FROM 
    members WHERE status="Terminated" ORDER BY dot DESC;`

    , async function (error, results, fields) {
        if (error) console.log(error);
        // console.log(filtered);
        // console.log(filtered.length)
        res.status(200).send(results);

    });
});


module.exports = router;