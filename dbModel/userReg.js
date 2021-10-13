const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    idNo :{
        type: Number,
        required: true,
    },
    email :{
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    secondName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordConfirm: {
        type: String,
        required: true,
    }, 
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;