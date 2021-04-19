var express = require('express');
var app = express();
const router = express.Router();
var multer = require('multer')
var cors = require('cors');

app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, `profilePics`)
},
filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname )
    const fileType = file.originalname.split('.')[1] 
    cb(null, req.headers.nameofimage + '.' + fileType )
}
})

var upload = multer({ storage: storage }).single('file')

router.post('/',function(req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json(err)
        } else if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    return res.status(200).send("Image Successfully Uploaded.")

    })

});



module.exports = router;