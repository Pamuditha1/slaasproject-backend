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

router.get('/', async (req, res) => {

    console.log(req)
    console.log(req.body)
    const searchWord = req.body.searchWord
    console.log(searchWord)

    if(!req.body.searchWord) {
        res.status(404).send('Empty Search')
    }

    searchPersonal(searchWord, res)   

});

// router.get('/result', async (req, res) => {

    

// });

function searchPersonal(searchWord, res) {

    connection.query(`SELECT * FROM member_personal WHERE 
    title LIKE '%${searchWord}%' OR nameWinitials LIKE '%${searchWord}%' OR fullName LIKE '%${searchWord}%' OR commonFirst LIKE '%${searchWord}%' 
    OR commomLast LIKE '%${searchWord}%' OR gender LIKE '%${searchWord}%' OR dob LIKE '%${searchWord}%' OR nic LIKE '%${searchWord}%' OR mobileNo LIKE '%${searchWord}%' 
    OR fixedNo LIKE '%${searchWord}%' OR email LIKE '%${searchWord}%' OR resAddrs LIKE '%${searchWord}%' OR perAddrs LIKE '%${searchWord}%'`,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            searchOfficial(searchWord, res)
            return
        }

        let i = 0
        let personalIDS = []
        results.forEach(e => {
            personalIDS[i] = e.personalID
            i++
        });
        res.send(personalIDS)        

    });
    
}

function searchOfficial(searchWord, res) {

    connection.query(`SELECT * FROM member_official WHERE 
    designation LIKE '%${searchWord}%' OR department LIKE '%${searchWord}%' OR placeOfWork LIKE '%${searchWord}%' OR offMobile LIKE '%${searchWord}%' 
    OR offLand LIKE '%${searchWord}%' OR offFax LIKE '%${searchWord}%' OR offEmail LIKE '%${searchWord}%' OR offAddrs LIKE '%${searchWord}%'`,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            searchProfessional(searchWord, res)
            return
        }

        let i = 0
        let officialIDS = []
        results.forEach(e => {
            officialIDS[i] = e.officialID
            i++
        });
        res.send(officialIDS)

    });
}

function searchProfessional(searchWord, res) {

    connection.query(`SELECT * FROM member_professional WHERE 
    profession LIKE '%${searchWord}%' OR specialization1 LIKE '%${searchWord}%' OR specialization2 LIKE '%${searchWord}%' OR specialization3 LIKE '%${searchWord}%' 
    OR specialization4 LIKE '%${searchWord}%' OR specialization5 LIKE '%${searchWord}%' `,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            searchAcademic(searchWord, res)
            return
        }
        let i = 0
        let professionalIDS = []
        results.forEach(e => {
            professionalIDS[i] = e.professionalID
            i++
        });
        res.send(professionalIDS)

    });
}

function searchAcademic(searchWord, res) {

    connection.query(`SELECT * FROM member_academic WHERE 
    year LIKE '%${searchWord}%' OR degree LIKE '%${searchWord}%' OR disciplines LIKE '%${searchWord}%' OR university LIKE '%${searchWord}%' `,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            searchMembership(searchWord, res)
            return
        }
        let i = 0
        let professionalIDS = []
        results.forEach(e => {
            professionalIDS[i] = e.professionalID
            i++
        });
        res.send(professionalIDS)

    });
}

function searchMembership(searchWord, res) {

    connection.query(`SELECT * FROM member_membership WHERE 
    gradeOfMembership LIKE '%${searchWord}%' OR section LIKE '%${searchWord}%' OR sendingAddrs LIKE '%${searchWord}%' `,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            searchPayment(searchWord, res)
            return
        }
        let i = 0
        let membershipIDS = []
        results.forEach(e => {
            membershipIDS[i] = e.membershipID
            i++
        });
        res.send(membershipIDS)

    });
}

function searchPayment(searchWord, res) {

    connection.query(`SELECT * FROM payments WHERE 
    paidDate LIKE '%${searchWord}%' OR recordedDate LIKE '%${searchWord}%' OR method LIKE '%${searchWord}%' OR amount LIKE '%${searchWord}%'
    OR bank LIKE '%${searchWord}%' OR branch LIKE '%${searchWord}%' OR accountNo LIKE '%${searchWord}%' OR description LIKE '%${searchWord}%' `,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            searchMember(searchWord, res)
            return
        }
        let i = 0
        let paymentIDS = []
        results.forEach(e => {
            paymentIDS[i] = e.paymentID
            i++
        });
        res.send(paymentIDS)

    });
}

function searchMember(searchWord, res) {

    connection.query(`SELECT * FROM members WHERE memberID LIKE '%${searchWord}%' OR status LIKE '%${searchWord}%' OR
    enrollDate LIKE '%${searchWord}%' OR appliedDate LIKE '%${searchWord}%' OR councilPosition LIKE '%${searchWord}%' OR
    memberFolioNo LIKE '%${searchWord}%' OR membershipNo LIKE '%${searchWord}%' OR memPaidLast LIKE '%${searchWord}%' `,

    async function (error, results, fields) {
        if (error) throw error;
        
        if(results.length === 0) {
            console.log('Not Found Record')
            res.send('Not Found Record')
            return
        }
        let i = 0
        let memberIDS = []
        results.forEach(e => {
            memberIDS[i] = e.memberID
            i++
        });
        res.send(memberIDS)

    });
}


module.exports = router;