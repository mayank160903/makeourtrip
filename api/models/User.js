const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name : String,
    email : {type: String , unique: true} ,
    number: Number,
    password : String,
    otp: String,
    verified: {type: Boolean, default: false},
});

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel;