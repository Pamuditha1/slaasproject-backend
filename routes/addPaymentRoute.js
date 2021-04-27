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
    const paymentData = req.body.paymentData
    const previousRecords = req.body.previousRecords

    console.log(payment)
    console.log("payment data", paymentData)
    console.log("previous data", payment)

    // res.status(200).send('Payment Received')

    connection.query(`SELECT memberID FROM members WHERE membershipNo='${paymentData.paymentRecord.membershipNo}' 
    OR nic='${paymentData.paymentRecord.nic}'`, async function (error, results, fields) {

        if (error) throw error;
        
        if(results.length > 1) {
            console.log("More than 1 member Found");
            res.status(404).send('More than 1 member found. Payment Rejected');
            return;
        }
        if (results.length === 0) {
            console.log("No member record");
            res.status(400).send('No member record. Payment Rejected');
            return;
        } 
        console.log(results[0].memberID)
        const memberID = results[0].memberID
        addPayment(res, paymentData, previousRecords, memberID)

    });
    
});

function addPayment(res, paymentData, previousRecords, memberID) {

    const paymentDataSave = [paymentData.invoiceNo, paymentData.dateTimeSave, paymentData.today, paymentData.time,
        paymentData.paymentRecord.paymentMethod , paymentData.paymentRecord.yearOfPayment ,
        paymentData.paymentRecord.admissionFee,paymentData.paymentRecord.arrearsFee,
        paymentData.paymentRecord.yearlyFee, paymentData.paymentRecord.idCardFee, 
        paymentData.total, paymentData.paymentRecord.description, paymentData.totalWords,  memberID];
        
    connection.query(`INSERT INTO payments (invoiceNo, timeStamp, date, time, type, yearOfPayment, admission, arrears, yearlyFee, idCardFee, total ,description \
        ,totalWords, memberID) \
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)` , paymentDataSave , (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            return 
        }
        console.log(results)
        console.log('Successfully Added Payment')
        res.status(200).send('Payment Successfully Recorded')

    });
}

module.exports = router;

