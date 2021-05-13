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

    let today = new Date().getFullYear()
    console.log("Today Year", today)
    connection.query(`SELECT 
    title, nameWinitials, status, dot, lastPaidForYear, arrearsConti, memPaidLast, nic, mobileNo, email, resAddrs, gradeOfMembership, section, enrollDate, 
    councilPosition, memberFolioNo, membershipNo
    FROM 
    members;`

    , async function (error, results, fields) {
        if (error) console.log(error);
        
        let filtered = results.filter((m) => {

            if(m.lastPaidForYear) {
                let lastPaid = m.lastPaidForYear
                let dif = parseInt(today) - parseInt(lastPaid) 
                console.log(dif)
                if(dif > 1) return true

                return false
            }
            else false
        })
        console.log(filtered);
        console.log(filtered.length)
        res.status(200).send(filtered);

    });
});

module.exports = router;