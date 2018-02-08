const express = require('express');
require('../models/user');

const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://naky:!SKdltm1303@ds257077.mlab.com:57077/naky');

let User = mongoose.model('users');

//add message
router.post('/add',(req, res, next) => { 
        
    let to = req.body.to;
    let from = req.body.from;
    let type = req.body.type;
    let message = req.body.message;
    let contents = req.body.contents;

    User.update({"_id": to}, {$push:   {"messages": {"from":from, "to":to, "type":type, "message": message, "contents":contents}}}, (err, result) => {
        if(err) {
            res.status(500).send({result:"fail", body: err});
        } else {
            res.status(200).send({result:"success", body: result});
        }
    });
});

//add massage to multiple targets by _ids
router.post('/add/multiple',(req, res, next) => { 
        console.log(req.body.to)
    let to = req.body.to; //sould be array
    let from = req.body.from; 
    let type = req.body.type;
    let message = req.body.message;
    let contents = req.body.contents;
    // to sould be array
    User.update({"_id":{$in:to} }, {$push: {"messages": {"from":from, "to":to, "type":type, "message": message, "contents":contents}}},{multi: true}, (err, result) => {
        if(err) {
            res.status(500).send({result:"fail", body: err});
        } else {
            if(result.ok == 0) 
                res.status(200).send({result:"fail"});
            else
                res.status(200).send({result:"success"});
        }
    });
});


//get messages
router.get('/get/:_id', (req, res, next) => {
    User.find({"_id": req.params._id}).select('messages').exec((err, result) => {
        if(err)
            res.status(500).send({result:"fail", body:err})
        else{
            let messages = result[0].messages;
            res.status(200).send(messages);
        } 
    });
});

//one massage change to read :true
router.post('/read', (req, res, next) => {
    let _id =  req.body._id;
    let m_id = req.body.m_id;
    User.update({"_id": _id, "messages._id":m_id},{ $set:{"messages.$.read":true}}, {multi: true},(err, result) => {
        if(err)
            res.status(500).send({result:"fail", body:err});
        else           
            res.status(200).send({result:"success", body:result});   
    }); 
});

//all massage change to read :true
router.post('/read/all', (req, res, next) => {
    let _id =  req.body._id;
    let readObject = new Object(); 
    let errors = [];
    let success = [];

    User.find({"_id": _id}).select('messages.read').exec((err, result) => {
        if(err)
            res.status(500).send({result:"fail", body:err});
           
    }).then((val) =>{
        let messages = val[0].messages;
        for(i =0; i < messages.length; i ++){
            if(messages[i].read == false) {
                User.update({"_id": _id, "messages.read": false},{ $set:{"messages.$.read":true}},(err, result) => {
                    if(err)
                        errors.push(err);
                    else           
                        success.push(result);    
                });
            }
        }
        if(errors.length != 0)
            res.status(500).send({result:"fail", body:errors});
        else
            res.status(200).send({result:"success", body:success});
    });
});



//delete message
router.post('/delete', (req, res, next) => {
    let _id = req.body._id;
    let m_id =req.body.m_id;
    User.update({ "_id": _id},{ $pull: { "messages" : {"_id": m_id}}},(err, result) =>{
        if(err)
            res.status(500).send({result:"fail", body:err})
        else{           
            User.find({"_id": _id}).select('messages').exec((err, result) => {
                if(err)
                    res.status(500).send({result:"fail", body:err})
                else{
                    let messages = result[0].messages;
                    res.status(200).send(messages);
                } 
            });
        } 
    });
});

//delete all message
router.post('/delete/all', (req, res, next) => {
    let _id = req.body._id;
    User.update({ "_id": _id},{ $set: { "messages" :[]}},(err, result) =>{
        if(err)
            res.status(500).send({result:"fail", body:err})
        else{           
            User.find({"_id": _id}).select('messages').exec((err, result) => {
                if(err)
                    res.status(500).send({result:"fail", body:err})
                else{
                    let messages = result[0].messages;
                    res.status(200).send(messages);
                } 
            });
        } 
    });
});

module.exports = router;