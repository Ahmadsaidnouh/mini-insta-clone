const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const CryptoJs = require("crypto-js");

const adminSchema = new mongoose.Schema({
    adminName : {
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
        default: "superAdmin"
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    }
}, {timestamps: true});

adminSchema.pre("save", function(next) {
    this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT));
    this.phone = CryptoJs.AES.encrypt(this.phone, process.env.SECRET_KEY).toString();
    next();
});

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;