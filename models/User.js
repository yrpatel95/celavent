const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    userType:{
        type: String,
        required: false
    },
    vendorServiceList:{
        type: Array,
        required: false
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;