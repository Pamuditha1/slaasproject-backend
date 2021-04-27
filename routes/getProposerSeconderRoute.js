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

router.get('/proposer/:memNo', async (req, res) => {

    console.log(req.params.memNo)

    connection.query(`SELECT membershipNo, nameWinitials, sendingAddrs, mobileNo 
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

router.get('/seconder/:memNo', async (req, res) => {

    console.log(req.params.memNo)

    connection.query(`SELECT membershipNo, nameWinitials, sendingAddrs, mobileNo 
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

// function getSeconder(res, res, proposer) {

//     connection.query(`SELECT nameWinitials, sendingAddrs, mobileNo 
//     FROM members
//     WHERE membershipNo = "${req.params.memNo}";`

//     , async function (error, results, fields) {
//         if (error) throw error;
        
//         console.log(results[0])

//         res.status(200).json({
//             proposer: proposer,
//             seconder: results
//         });

//     });
// }

module.exports = router;