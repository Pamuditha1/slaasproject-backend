const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const { v1: uuidv1 } = require('uuid');

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

router.get('/get-invoice', async (req, res) => {

    connection.query(`SELECT invoiceNo FROM payments ORDER BY paymentID DESC LIMIT 1`, async function (error, results, fields) {

        if (error) throw error;

        const invoiceNo = results[0].invoiceNo
        const newInvoiceNo = invoiceNo + 1

        res.send(`${newInvoiceNo}`)

    });
    
});

router.post('/', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the member available
    console.log(req.body)
    const payment = req.body;

    res.status(200).send('Payment Received')

    // connection.query(`SELECT memberID FROM members WHERE membershipNo='${payment.membershipNo}' 
    // OR nic='${payment.nic}'`, async function (error, results, fields) {

    //     if (error) throw error;
        
    //     if(results.length > 1) {
    //         console.log("Two Members Found");
    //         res.status(404).send('Two Members Found. Payment Rejected');
    //         return;
    //     }
    //     // if (results.length === 0) {
    //     //     console.log("No member record");
    //     //     res.status(400).send('No member record. Payment Rejected');
    //     //     return;
    //     // } 
    //     console.log(results[0].memberID)
    //     const memberID = results[0].memberID
    //     addPayment(res, payment, memberID)

    // });
    
});

function addPayment(res, payment, memberID) {

    const paymentData = [payment.invoiceNo, payment.nic, payment.date, payment.paymentMethod , 
        payment.yearOfPayment ,payment.admissionFee, payment.yearlyFee,
        payment.arrearsFee, payment.idCardFee, payment.total, payment.description, payment.totalWords,  memberID];
        
    connection.query(`INSERT INTO payments (invoiceNo, nic, date, type, yearOfPayment, admission, arrears, yearlyFee, idCardFee, total ,description \
        ,totalWords, memberID) \
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)` , paymentData , (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            return 
        }
        console.log(results)
        console.log('Successfully Added Payment')
        

    });
}

module.exports = router;

