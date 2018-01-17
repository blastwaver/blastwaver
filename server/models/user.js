
const mongoose = require('mongoose');
const { Schema } = mongoose;

var UserSchema = mongoose.Schema({
    "datetime" : {
        type: Date,
        default: Date.now
    },
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
    }
});

mongoose.model('users', UserSchema);





