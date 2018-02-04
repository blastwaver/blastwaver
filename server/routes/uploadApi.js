const express = require('express');

const router = express.Router();

const multer = require('multer');

const crypto = require('crypto');

const path = require('path');

const fs = require('fs');

const  imageFolderPath = __dirname +'../../../images';

const storage = multer.diskStorage({
  destination:  imageFolderPath,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) 
        return cb(err);

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

//upload file
router.post('/', (req, res, next) => {
    let upload = multer({ storage: storage }).single('photo');
    let filename = '';
    upload(req, res, (err) => {
      if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured")
      }  else {
            // No error occured.
         filename = req.file.filename;
         console.log(req.file.path)
         return res.send(filename); 
      }
    });
       
});

//image delete
router.delete('/delete/:file',(req, res, next) => {

  let filePath = imageFolderPath + '/' + req.params.file;
  
  fs.stat(filePath,  (err, stats) => {
    console.log(stats);//here we got all information of file in stats variable
    if (err) return res.status(500).send(err);
    
    fs.unlink(filePath,(err) => {
         if(err) return res.status(500).send(err);
         res.status(200).send('file deleted successfully');
    });  
 });
});


module.exports = router;