redis = require('redis');
const express = require('express');
const router = express.Router();

var client = redis.createClient(16379, '192.168.99.100');


// add chat
router.post('/add',( req, res, next) => {
    let data = req.body;
    let key = data.room + data.time;
    //important- " store as  %,% it shoulbe replaced on client side; 
    let chat = data.chat.replace(/"/g, "%,%");
    // let photoUrl = data.photoUrl.replace(/"/g, "%,%");
    client.hmset(key, 
                 "_id", '{ "_id": "' + data._id + '"',
                //  "photoUrl", '"photoUrl": "' + photoUrl + '"',
                 "time", '"time": "' + data.time + '"',
                 "chat", '"chat": "' + chat + '"',
                 "room", '"room": "' + data.room + '"}',
                 (err, result) => {
                    // console.log(result);
                    if(err) {
                        res.status(500).send(err);
                    }
                    else if(result == "OK") {
                        client.sadd(data.room, key, (err, result) => {
                            if(err){
                                res.status(500).send({result: "fail", body: err});
                            } else {
                                res.status(200).send({result: "success", body:result.toString()}); 
                            }
                        });
                    } else {
                        res.status(500).send({result: "fail", body: err});
                    }
                        
                });
});

router.get('/get/:room', (req, res,next) => {
    let key = req.params.room;
    // console.log(key);
    client.sort(key, "by", "weight_*-> time",
                                //  "get", "*->username",
                                 "get", "*->_id",
                                 "get", "*->time",
                                 "get", "*->chat",
                                 "get", "*->room"
                                ,(err, result) => {
                                    if(err){
                                        res.status(500).send(err);
                                    } else {
                                        //number return 1 or 0
                                        console.log(result)
                                      let string = "[" + result.toString() + "]";
                                      let jsonString = JSON.parse(string);
                                    //    console.log(string);
                                        res.status(200).send(jsonString); 
                                    }
                                });
 });

module.exports = router;