
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
            console.log(user);
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
            res.status(500).send(err);
        } else {
            res.status(200).send(user);
        }
    });
})

//delete
router.post('/delete',( req, res, next) => {
    let _id = req.body._id;
    // console.log(req.body._id);
    User.findById({"_id": _id}, (err, user) =>{
        console.log(err);
    }).remove((err) => {
        console.log(err);
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

//add(request) Friend
router.post('/friends/add',(req, res, next) => {
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
                    if(err) {console.log("add friend err(my side): " + err);
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
router.post('/friends/accept',(req, res, next) => {
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
                    res.status(200).send(result);
            });
        }   
    });
});

// get fList
router.get('/friends/list/:_id',(req, res, next) => {
    
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
        User.find({"_id": {$in: list}}).select('_id username email photoUrl fList.f_id fList.chatRoom fList.status')
            // .populate({match: {"fList.f_id": my_id},select:'status'})    
            .exec((err, result) =>{
            if (err) {
                res.status(500).send(err); 
            } else {
                result.forEach(friend => {
                    let fUser ={};
                    fUser._id = friend._id;
                    fUser.usrname = friend.username;
                    fUser.email = friend.email;
                    fUser.photoUrl = friend.photoUrl;
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
router.post('/friends/remove',(req, res, next) => {
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