const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    idNo: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    licenseNo: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    file1: {
        data: Buffer,
        contentType: String,
    },
    status: {
        type: String,
    },
    comments: {
        type: String,
    }
}, {timestamps: true});

const File = mongoose.model('Applications', applicationSchema);
module.exports = File;