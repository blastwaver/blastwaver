const express = require('express');
require('../models/User');

const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://naky:!SKdltm1303@ds257077.mlab.com:57077/naky');

let User = mongoose.model('users');

//add(request) Friend
router.post('/add',(req, res, next) => {
    let my_id = req.body.my_id;
    let f_id = req.body.f_id;
    let chatRoom = my_id + f_id;
    /* duplicate check */
    User.find({$and:[{"_id": my_id}, {"fList.f_id":f_id}]}, (err, result) => {
        if(err) {
            res.status(500).send({error:err});
        } else {
            if(result.length >= 1) {
                res.status(500).send({error:"already have this friend in the list"}); 
            } else {
                 /* store friend info to mine */
                User.update({"_id": my_id}, {$push: {"fList": {"f_id":f_id, "status":"request", "chatRoom":chatRoom}}}, (err, result) => {
                    if(err) {
                        console.log("add friend err(my side): " + err);
                    } else {
                        if(result.n === 1) {
                            /* store my info to friend's */
                            User.update({"_id": f_id}, {$push: {"fList": {"f_id":my_id, "status":"recieve", "chatRoom":chatRoom}}}, (err, result) =>{   
                                    if(err){
                                        console.log("add friend err: (friend side)" + err);
                                    }
                                    else{
                                        if(result.n ===1)
                                            res.status(200).send({result:"succeed"});
                                    }                
                                }
                            );
                        } else { console.log("something went wrong ");}
                    }            
                });
            } 
        }        
    });  
});


// router.post('/test',(req, res, next) => {
//     let my_id = req.body.my_id;
//     let f_id = req.body.f_id;
//     User.find({$and:[{"_id": my_id}, {"fList.f_id":f_id}]}, (err, result) => {
//         if(err)
//             res.status(500).send(err);
//         else
//             res.status(200).send(result);
//     });
// });

// accept friend and state update
router.post('/accept',(req, res, next) => {
    let my_id = req.body.my_id;
    let f_id = req.body.f_id;

    User.update({"_id": my_id, "fList.f_id":f_id},{ $set:{"fList.$.status":"friend"}},(err, result) => {
        if(err) {
            res.status(500).send(err);
        } else {
            User.update({"_id": f_id, "fList.f_id":my_id},{ $set:{"fList.$.status":"friend"}},(err, result) => {
                if(err)
                    res.status(500).send(err);
                else
                    res.status(200).send({result:'succeed'});
            });
        }   
    });
});

// get fList
router.get('/list/:_id',(req, res, next) => {
    
    let my_id = req.params._id;
    let list = new Array();
    
    let fUsers = [];
    User.find({ "_id": my_id}).select('fList.status fList.f_id').exec((err, result) => {        
        
        if(err) {
            res.status(500).send(err);            
        } else {
            result[0].fList.forEach(element => {
                list.push(element.f_id);
            });
        }        
    }).then(() => {
        User.find({"_id": {$in: list}}).select('_id username email photoUrl comment fList.f_id fList.chatRoom fList.status')
            // .populate({match: {"fList.f_id": my_id},select:'status'})    
            .exec((err, result) =>{
            if (err) {
                res.status(500).send(err); 
            } else {
                result.forEach(friend => {
                    let fUser ={};
                    fUser._id = friend._id;
                    fUser.username = friend.username;
                    fUser.email = friend.email;
                    fUser.photoUrl = friend.photoUrl;
                    fUser.comment = friend.comment;
                    friend.fList.forEach(list =>{ 
                        if(list.f_id === my_id){ 
                            if(list.status == "recieve") {
                                fUser.status = "request";
                            } else if(list.status == "request") {
                                fUser.status = "recieve";
                            } else {
                                fUser.status = list.status; 
                            }
                            fUser.chatRoom = list.chatRoom; 
                        }
                    });
                    fUsers.push(fUser);
                })
                res.status(200).send(fUsers); 
            }
        })
        // .where("fList.f_id").in([my_id])   
    })
});

//remove friend
router.post('/remove',(req, res, next) => {
    let my_id = req.body.my_id;
    let f_id = req.body.f_id;
    //from my list
    User.update({ "_id": my_id},{ $pull: { "fList" : {"f_id": f_id}}},(err, result) =>{
        if(err){
            res.status(500).send(err); 
        } else {
            //from another who was friend :( 
            User.update({ "_id": f_id},{ $pull: { "fList" : {"f_id": my_id}}},(err, result) =>{
                if(err){
                    res.status(500).send(err); 
                } else {
                    res.status(200).send(result);  
                }
            });
        }
    });
    
});

module.exports = router;
