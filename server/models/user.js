
const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendsSchema = mongoose.Schema({
    "f_id": {type:String},
    "status": {type: String, default: "unknwon"},
    "chatRoom":{type: String}
},{ timestamps: true });

const messageSchema = mongoose.Schema({
    "from": {type:String},
    "to": {type: String},
    "type": {type: String},
    "message":{type: String},
    "read": {type: Boolean, default: false},
    "contents":{type: Schema.Types.Mixed}
},{ timestamps: true });

const UserSchema = mongoose.Schema({

    "googleId":{
        type:String
    },
    "username" : {
        type:String
    },
    "email" : {
        type:String
    },
    "photoUrl" : {
        type:String
    },
    "comment" : {
        type:String,
        default: "Hi, there!"
    },
    "cProfile": {type: Boolean, default: false},
    "fList" : [friendsSchema],
    "messages":[messageSchema],
},{ timestamps: true });



mongoose.model('users', UserSchema);





