const config = require('config');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors')
const envVariables = require('./envVariables')

var path = require('path');
global.appRoot = path.resolve(__dirname);

const auth = require('./routes/authRoute');
const users = require('./routes/userRoute');
const members = require('./routes/memberRoute');
const uploadMembers = require('./routes/csvUploadRoute');
const viewMembers = require('./routes/viewMemberRoute');
const viewAllMembers = require('./routes/allMembersRoute')
const userLogin = require('./routes/userLogin');
const searchMember = require('./routes/searchMembersRoute')
const addPayment = require('./routes/addPaymentRoute')
const viewPayments = require('./routes/viewPayments')
const viewProfile = require('./routes/viewProfile')
const profilePicUpload = require('./routes/uploadProfilePic')
const viewProfilePic = require('./routes/viewProfilePic')
const proposerAseconder = require('./routes/getProposerSeconderRoute')
const getMembershipNo = require('./routes/getMembershipNo')
const memberForReceipt = require('./routes/getMemberForReceipt')
const terminateMember = require('./routes/terminateMemberRoute')
const paymentsHistory = require('./routes/paymentsHistoryRoute')
const sendMails = require('./routes/sendEmailRoute')
const outdated = require('./routes/getOutdatedMemberships')
const filterPayments = require('./routes/filterPayments')
const calculateArrears = require('./routes/calculateArrears')
const grades = require('./routes/gradesRoute')
const sections = require('./routes/sectionsRoute')
const continueMembership = require('./routes/continueTerminatedRoute')


// if (!config.get('jwtPrivateKey')) {
//     console.log('FATAL ERROR : jwtPrivateKey is not defined.');
//     console.log(config.get('jwtPrivateKey'));
//     process.exit(1);
// }

// app.use(function(req,res,next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", 'PUT, POST, GET, DELETE, OPTIONS');
//     next();
// });
app.use(cors())
app.use(express.json());
app.use('/slaas/api/register-user', users);
app.use('/slaas/api/user/register-member', members);
app.use('/slaas/api/user/add-profilepic', profilePicUpload);
app.use('/slaas/api/user/get-profilepic', viewProfilePic);
app.use('/slaas/api/user/upload-members', uploadMembers);
app.use('/slaas/api/user/view/members', viewMembers);
app.use('/slaas/api/user/member/profile', viewProfile)
// app.use('/slaas/api/user/view/members/all', viewAllMembers);
app.use('/slaas/api/user/search', searchMember);
app.use('/slaas/api/user/payment', addPayment);
app.use('/slaas/api/user/refrees', proposerAseconder);
app.use('/slaas/api/user/membershipNo', getMembershipNo)
app.use('/slaas/api/user/receipt', memberForReceipt)
app.use('/slaas/api/user/payment/view', viewPayments);
app.use('/slaas/api/user/payment/filter', filterPayments);
app.use('/slaas/api/user/mails', sendMails);
app.use('/slaas/api/user/terminate-member', terminateMember);
app.use('/slaas/api/user/continue-terminated', continueMembership)
app.use('/slaas/api/user/member/payment-records', paymentsHistory);
app.use('/slaas/api/user/outdated', outdated);
app.use('/slaas/api/user/calculate-arrears', calculateArrears);
app.use('/slaas/api/user/grades', grades);
app.use('/slaas/api/user/sections', sections);
app.use('/slaas/api/user/login', userLogin);
app.use('/slaas/api/applicant/login', userLogin);
app.use('/slaas/api/auth', auth);

var connection = mysql.createConnection(envVariables.mysqlConnection);
 
connection.connect((err) => {
    if(!err) return console.log("Successfully connected to MySql database");

    else console.log("Database connection failed" , JSON.stringify(err));
});

app.get('/slaas/api/',(req,res) => {
    
    connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        // console.log('The solution is: ', results[0].userName);
        //  const re = Object.assign({}, results);
        //  console.log(re.0);
        const name = "Jayod";

        let i=0;
        for(i=0; i<results.length; i++) {
            if(name == results[i].userName) {
                res.send(results[i].email);
                console.log(results[i].email);
            }
        }

    });
    
    connection.end();
});


const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

module.exports = connection;


