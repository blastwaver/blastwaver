
const express = require('express');
require('../models/user');

const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://naky:!SKdltm1303@ds257077.mlab.com:57077/naky');

let User = mongoose.model('users');

//Users CRUD
//All user
router.get('/', (req, res,next) => {
   User.find((err, users) => {
       if(err) { 
           res.status(500).send(err);
       } else {
           res.status(200).send(users);
       }
   })     
});

//one user
router.get('/:_id', (req, res,next) => {
    User.find({ "_id": req.params._id }, (err, users) => {
        if(err) { 
            res.status(500).send(err);
        } else {
            res.status(200).send(users);
        }
    }); 
 });

 //get user by googleId
 router.get('/google/:_id', (req, res,next) => {
    User.find({ "googleId": req.params._id }, (err, users) => {
        if(err) { 
            res.status(500).send(err);
        } else {
            res.status(200).send(users);
        }
    }); 
 });


 //create
router.post('/create',( req, res, next) => {

    let newUser = new User(req.body);

    newUser.save((err, user ) => {
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(user);
            // console.log(user);
        }
    });
});

//update
router.post('/update',(req, res, next) => { 
    let _id = req.body._id;
    let data = req.body;
    delete data._id;
    User.findByIdAndUpdate({"_id": _id}, data, (err, user) =>{
        if(err){
            res.status(500).send({result: 'error', body: err});
        } else {
            res.status(200).send({result: 'success', body: user});
        }
    });
})

//delete
router.post('/delete',( req, res, next) => {
    let _id = req.body._id;
    // console.log(req.body._id);
    User.findById({"_id": _id}, (err, user) =>{
        // console.log(err);
    }).remove((err) => {
        // console.log(err);
    })
});


//users Search By Name
router.get('/search/name/:username', (req, res,next) => {
    let searchPhrase = req.params.username;
    let regularExpression = new RegExp(".*" + searchPhrase + ".*","i"); 
    User.find({ "username": regularExpression}, (err, users) => {
        if(err) { 
            res.status(500).send(err);
        } else {
            res.status(200).send(users);
        }
    }); 
 });

//user cProfile change data = {my_id:"string", cProfile: boolean }
router.post('/profile/select',(req, res, next) => {
    User.update({"_id":req.body.my_id}, {$set:{"cProfile":req.body.cProfile}},(err, result) => {
        if (err) 
            return  res.status(500).send(err);
        return res.status(200).send(result);
    });
});

 //////////////////////////////////// friend API ///////////////////////////////////////////////////////


module.exports = router;