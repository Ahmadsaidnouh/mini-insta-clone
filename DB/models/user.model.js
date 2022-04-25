const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const CryptoJs = require("crypto-js");

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    accountActive: {
        type: Boolean,
        default: true
    },
    accountBlocked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

userSchema.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT));
    this.phone = CryptoJs.AES.encrypt(this.phone, process.env.SECRET_KEY).toString();
    next();
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;