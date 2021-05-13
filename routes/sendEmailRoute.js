const express = require('express');
const { result, reject } = require('lodash');
const router = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');

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

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'pamudithaweb@gmail.com',
        pass: '0112704105'
    }
});

let mailContent={
    from: 'Pamuditha Web',
    to: '',
    subject: 'First Node.js email',
    text: 'Hi,This is a test mail sent using Nodemailer',
    html: '<h1>You can send html formatted content using Nodemailer with attachments</h1>',
    attachments: [
        {
            filename: 'image1.png',
            path: appRoot + '/profilePics/image1.png'
        }
    ]
};

router.post('/', (req, res) => {

    console.log("Body", req.body)

    let emails = []
    let sections = []
    let grades = []

    // let sectionEmails = []
    let gradeEmails = []

    const mailsList = req.body.data
    mailsList.forEach((m) => {
        if(m.includes('@')) {
            emails.push(m)
            return
        }
        else if(m.includes('Section')) {
            let sectionPart = m.split(" ")[1]
            sections.push(sectionPart)
            return
        }
        grades.push(m)
    })
    console.log("Emails -> ", emails)
    console.log("Sections -> ",sections)
    console.log("Grades -> ",grades)

    let sectionQuery = sections.map((s) => {
        return `section="${s}" OR`
    })
    let sectionQueryString = sectionQuery.join(' ')
    console.log("Sec Query", sectionQueryString)
    res.send('Received')
    sendMailstoSections(sectionQueryString)
    // sendMailstoEmails(emails)
    // sendMailstoSections(sections)
    //     .then(r => console.log("Resolved", r))
    // sendMailstoGrades(grades, gradeEmails)
    
})
function sendMailstoSections(query) {
    
    connection.query(`SELECT email FROM members WHERE ${query};`
    ,function (error, results, fields) {
        if (error) throw error;
        
        console.log('Section Emails', results)
        
    });
}

function sendMailstoEmails(emails) {
    emails.map((e) => {

        mailContent.to = e;

        transporter.sendMail(mailContent, function(error, data){
            if(error){
                console.log(`Unable to send mail to ${e}`, error);
            }else{
                console.log(`Email send successfully to ${e}`);
            }
        });
        
    })
}
// function sendMailstoSections(sections) {
//     let sectionEmails = []
//     return new Promise((resolve, reject) => {        

//         sections.forEach((s) => {
//             connection.query(`SELECT email FROM members WHERE section="${s}";`
//             ,function (error, results, fields) {
//                 if (error) throw error;
                
//                 results.forEach((e) => {
//                     sectionEmails.push(e.email)
//                     // console.log(sectionEmails)
//                 })
                
//             });
//             // resolve(sectionEmails)
            
//         })
//         console.log(sectionEmails)
//     })
// }

function sendMailstoGrades(grades, gradeEmails) {

    grades.forEach((g) => {
        connection.query(`SELECT email FROM members WHERE gradeOfMembership="${g}";`
        , async function (error, results, fields) {
            if (error) throw error;
            
            results.forEach((e) => {
                gradeEmails.push(e.email)
                // console.log(e.email)
                console.log(gradeEmails)
            })
        });
    })
}



module.exports = router;

