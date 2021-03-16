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

let memberFirstName = '';
// const id = generateUniqueId({
//     useLetters: false,
//     length: 8
// });
let id = '';

let personalData = '';
let officialData = '';
let professionalData = '';
let membershipData = '';
let paymentData = '';

router.post('/', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the member available
    
    personalData = req.body.personalData;
    officialData = req.body.officialData;
    professionalData = req.body.professionalData;
    membershipData = req.body.membershipData;
    paymentData = req.body.paymentData;

    id = uuidv1();

    connection.query(`SELECT email FROM member_personal WHERE email='${personalData.email}'`, async function (error, results, fields) {
        let databaseError;
        if (error) throw error;
        // let i=0;
        // let alreadyReg = false;
        // for(i=0; i<results.length; i++) {
        //     if(personalData.email == results[i].email) {
        //         alreadyReg = true;
        //         break;
        //     }            
        // }
        // if (alreadyReg) {
        //     console.log("Member already Registered.");
        //     res.status(400).send('Member already Registered.');
        //     return;
        // } 
        else addPersonal(personalData,res,id,officialData)
        console.log(id);
    });   
});

function addPersonal(personalData,res,id,officialData) {
    const resAddrs = `${personalData.resAddOne}, ${personalData.resAddTwo }, ${personalData.resAddThree}, ${personalData.resAddFour}, 
    ${personalData.resAddFive}` ;
    const perAddrs =   `${personalData.perAddOne}, ${personalData.perAddTwo} , ${personalData.perAddThree}, ${personalData.perAddFour}, 
    ${personalData.perAddFive}`;

    const personal = [id, personalData.title, personalData.nameWinitials, personalData.nameInFull, personalData.firstName, personalData.lastName, 
    personalData.gender, personalData.dob, personalData.nic,  personalData.mobileNo, personalData.landNo, personalData.email, resAddrs, perAddrs];
        
    memberFirstName = personal[4]

    connection.query(`INSERT INTO member_personal (personalID, title, nameWinitials, fullName, commonFirst, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs)\
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)` , personal, (error, results, fields) => {
        // (error) ? res.status(404).send(error) : addResAddress()
            if(error) {
                res.status(404).send(error);
                return 
            }
            addOfficial(res,id,officialData)
        // console.log(id)
            
    });
    
};

function addOfficial(res,id,officialData) {
    const offAddrs =  `${officialData.offAddrslineOne}, ${officialData.offAddrslineTwo}, ${officialData.offAddrslineThree}, 
    ${officialData.offAddrslineFour}, ${officialData.offAddrslineFive}`;

    const official = [id, officialData.designation, officialData.division , officialData.placeWork, officialData.offMobile, 
    officialData.offLandNo, officialData.offFax, officialData.offEmail, offAddrs];

    connection.query(`INSERT INTO member_official (officialID, designation,department,placeOfWork,offMobile,offLand,\
        offFax,offEmail,offAddrs)\
    VALUES (?,?,?,?,?,?,?,?,?)` , official, (error, results, fields) => {
        
        // (!error) ? res.status(200).send("Successfully Added Member " + memberFirstName) : res.status(404).send(error);
        if(error) {
            res.status(404).send(error);
            // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
            deleteRow('member_personal', "personalID", id);
            return 
        }
        addProfessional(res,id,professionalData)
            
        // if(error) databaseError = error;
    
    });
}
function addProfessional(res,id,professionalData) {
    const professional = [id, professionalData.profession, professionalData.fieldOfSpecial[0] , professionalData.fieldOfSpecial[1] , 
    professionalData.fieldOfSpecial[2] , professionalData.fieldOfSpecial[3] , professionalData.fieldOfSpecial[4]];

    connection.query(`INSERT INTO member_professional (professionalID, profession,specialization1,specialization2,specialization3,specialization4,\
        specialization5)\
    VALUES (?,?,?,?,?,?,?)` , professional, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
            // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
            deleteRow('member_personal', 'personalID', id);
            deleteRow('member_official', 'officialID', id);
            return 
        }
        addAcademic(id,res,professionalData)

    });
}

function addAcademic(id,res,professionalData) {
    
    let academicData = [];
    var i;
    for(i=0; i<professionalData.academic.length; i++) 
    {
            
                academicData[i] = [professionalData.academic[i].year, professionalData.academic[i].degree , professionalData.academic[i].disciplines, 
                professionalData.academic[i].uni, id] ;

                connection.query(`INSERT INTO member_academic (year,degree,disciplines,university,professionalID)\
                    VALUES (?,?,?,?,(SELECT professionalID FROM member_professional WHERE professionalID = '${id}'))` , 
                    academicData[i], (error, results, fields) => {
                    if(error) {
                        res.status(404).send(error);
                        // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
                        // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
                        // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
                        deleteRow('member_personal', 'personalID', id);
                        deleteRow('member_official', 'officialID', id);
                        deleteRow('member_professional', 'professionalID', id);
                        return 
                    }                    
                    
                });

    }
    addProposer(res,id,membershipData)  
    
    
}


function addProposer(res,id,membershipData) {
    const proposer = [id, membershipData.proposer$seconder.proposer.name, membershipData.proposer$seconder.proposer.memNo , 
        membershipData.proposer$seconder.proposer.address ,membershipData.proposer$seconder.proposer.contactNo];

    connection.query(`INSERT INTO proposers (proposerID, name,membershipNo,address,contactNo) \
    VALUES (?,?,?,?,?)` , proposer, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
            // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
            // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
            deleteRow('member_personal', 'personalID', id);
            deleteRow('member_official', 'officialID', id);
            deleteRow('member_academic', 'professionalID', id);
            deleteRow('member_professional', 'professionalID', id);
            return 
        }
        addSeconder(res,id,membershipData)
        

    });
}

function addSeconder(res,id,membershipData) {
    const seconder = [id, membershipData.proposer$seconder.seconder.name, membershipData.proposer$seconder.seconder.memNo , 
        membershipData.proposer$seconder.seconder.address ,membershipData.proposer$seconder.seconder.contactNo];

    connection.query(`INSERT INTO seconders (seconderID, name,membershipNo,address,contactNo) \
    VALUES (?,?,?,?,?)` , seconder, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
            // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
            // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
            deleteRow('member_personal', 'personalID', id);
            deleteRow('member_official', 'officialID', id);
            deleteRow('member_academic', 'professionalID', id);
            deleteRow('member_professional', 'professionalID', id);
            deleteRow('proposers', 'proposerID', id);
            return 
        }
        addMembership(res,id,membershipData)
    });
}

function addMembership(res,id,membershipData) {
    const membership = [id, membershipData.gradeOfMem, membershipData.section , membershipData.memBefore , 
        membershipData.memFrom , membershipData.memTo , membershipData.sendingAddrs, id, id] ;

    connection.query(`INSERT INTO member_membership (membershipID, gradeOfMembership,section,memberBefore,memberFrom,memberTo,\
        sendingAddrs,proposerID,seconderID)\
    VALUES (?,?,?,?,?,?,?,(SELECT proposerID FROM proposers WHERE proposerID='${id}'),\
    (SELECT seconderID FROM seconders WHERE seconderID='${id}'))` , membership, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
            // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
            // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
            // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
            deleteRow('member_personal', 'personalID', id);
            deleteRow('member_official', 'officialID', id);
            deleteRow('member_academic', 'professionalID', id);
            deleteRow('member_professional', 'professionalID', id);
            deleteRow('proposers', 'proposerID', id);
            deleteRow('seconders', 'seconderID', id);
            return 
        }
        addMember(res,id)

    });
}

// function addPayment(res,id) {
//     if(membershipData.status === 'member') {
//     const payment = [id, paymentData.paymentDoneDate, paymentData.receivedData , paymentData.paymentMethod , 
//         paymentData.amount , paymentData.bank , paymentData.branch, paymentData.accountNo, paymentData.description,id] ;

//     connection.query(`INSERT INTO payments (paymentID, paidDate,recordedDate,method,amount,bank,\
//         branch,accountNo,description, memberID)\
//     VALUES (?,?,?,?,?,?,?,?,?,(SELECT memberID FROM members WHERE memberID='${id}'))` , payment, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//             // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//             // connection.query(`DELETE FROM member_membership WHERE membershipID='${id}'`);
//             // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
//             // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
//             deleteRow('member_personal', 'personalID', id);
//             deleteRow('member_official', 'officialID', id);
//             deleteRow('member_academic', 'professionalID', id);
//             deleteRow('member_professional', 'professionalID', id);
//             deleteRow('member_membership', 'membershipID', id);
//             deleteRow('proposers', 'proposerID', id);
//             deleteRow('seconders', 'seconderID', id);
//             return 
//         }   
//         addMember(res,id)
//     });
//     }
//     else {
//         connection.query(`INSERT INTO payments (paymentID) VALUES ('${id}') ` , (error, results, fields) => {
    
//             if(error) {
//                 res.status(404).send(error);
//                 // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//                 // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//                 // connection.query(`DELETE FROM member_membership WHERE membershipID='${id}'`);
//                 // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
//                 // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
//                 // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
//                 // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
//                 deleteRow('member_personal', 'personalID', id);
//                 deleteRow('member_official', 'officialID', id);
//                 deleteRow('member_academic', 'professionalID', id);
//                 deleteRow('member_professional', 'professionalID', id);
//                 deleteRow('member_membership', 'membershipID', id);
//                 deleteRow('proposers', 'proposerID', id);
//                 deleteRow('seconders', 'seconderID', id);
//                 return 
//             }   
//             addMember(res,id)
//         });
//     }
// }

function addMember(res,id) {
    let enroll ;
    let applied ;
    if(membershipData.enrollDate) {
        enroll = new Date();
    }
    else if(membershipData.appliedDate){
        applied = new Date();
    }
    const member = [id, membershipData.status, enroll , applied , '' , '' , '', '', id, id, id, id, id] ;

    connection.query(`INSERT INTO members (memberID, status, enrollDate, appliedDate, councilPosition, memberFolioNo, membershipNo,\
        memPaidLast, personalID, officialID, professionalID, paymentID, membershipID)\
    VALUES (?,?,?,?,?,?,?,?, (SELECT personalID FROM member_personal WHERE personalID='${id}'), 
    (SELECT officialID FROM member_official WHERE officialID='${id}'), 
    (SELECT professionalID FROM member_professional WHERE professionalID='${id}'), 
    (SELECT paymentID FROM payments WHERE paymentID='${id}'),
    (SELECT membershipID FROM member_membership WHERE membershipID='${id}'))` , 
    
    
    member, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            // connection.query(`DELETE FROM payments WHERE paymentID='${id}'`);
            // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
            // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
            // connection.query(`DELETE FROM member_membership WHERE membershipID='${id}'`);
            // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
            // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
            // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
            deleteRow('payments', 'paymentID', id);
            deleteRow('member_personal', 'personalID', id);
            deleteRow('member_official', 'officialID', id);
            deleteRow('member_academic', 'professionalID', id);
            deleteRow('member_professional', 'professionalID', id);
            deleteRow('member_membership', 'membershipID', id);
            deleteRow('proposers', 'proposerID', id);
            deleteRow('seconders', 'seconderID', id);
            return 
        }   
        res.status(200).send("Successfully Added Member " + memberFirstName)
    });
}



function deleteRow(table, key, id) {

    connection.query(`DELETE FROM ${table} WHERE ${key}='${id}'`, (error) => {
        if(error) console.log(error)
    })
    
}


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