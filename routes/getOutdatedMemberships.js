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

    let today = new Date()

    console.log("Today Year", today)
    connection.query(`SELECT 
    title, nameWinitials, status, dot, lastPaidForYear, lastMembershipPaid, arrearsConti, memPaidLast, nic, mobileNo, email, resAddrs, gradeOfMembership, section, enrollDate, 
    councilPosition, memberFolioNo, membershipNo
    FROM 
    members;`

    , async function (error, results, fields) {
        if (error) console.log(error);
        
        let filtered = results.filter((m) => {

            if(m.lastMembershipPaid) {
                let lastPaidTime = new Date(m.lastMembershipPaid).getTime()
                let todayTime = new Date(today).getTime()

                let timeDiff = todayTime - lastPaidTime
                let diffDays = timeDiff / (1000 * 60 * 60 * 24)

                if(diffDays > 365) {
                    m.lastMembershipPaid = new Date(m.lastMembershipPaid).toLocaleDateString()
                    m.memPaidLast = new Date(m.memPaidLast).toLocaleDateString()
                    m.dot = new Date(m.dot).toLocaleDateString()
                    return true
                }
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