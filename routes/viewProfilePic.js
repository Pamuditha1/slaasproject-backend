var express = require('express');
var app = express();
const router = express.Router();
var cors = require('cors');
const path = require('path');

app.use(cors());


// router.get('/:id',function(req, res) {

//     // const image = path.join(__dirname, '/', req.nic)
//     console.log(`${__dirname}/../profilePics/`)
//     // res.status(200).sendFile(image)
// });
router.get('/:name', function (req, res, next) {

    var options = {
        root: path.join(appRoot + '/profilePics'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        } 
    }

    var fileName = req.params.name + '.jpg'
    console.log(fileName)

    res.sendFile(fileName, options, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })

module.exports = router;