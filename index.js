const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const mysql = require('mysql');

const auth = require('./routes/authRoute');
const users = require('./routes/userRoute');
const members = require('./routes/memberRoute');

// if (!config.get('jwtPrivateKey')) {
//     console.log('FATAL ERROR : jwtPrivateKey is not defined.');
//     console.log(config.get('jwtPrivateKey'));
//     process.exit(1);
// }

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(express.json());
app.use('/slaas/api/registeruser', users);
app.use('/slaas/api/registermember', members);
app.use('/slaas/api/auth', auth);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '0112704105',
  database : 'slaasproject',
  multipleStatements: true
});
 
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


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

