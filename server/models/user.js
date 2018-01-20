
const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendsSchema = mongoose.Schema({
    "f_id": {type:String},
    "status": {type: String, default: "unknwon"},
    "chatRoom":{type: String}
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
    "fList" : [friendsSchema]
},{ timestamps: true });



mongoose.model('users', UserSchema);





