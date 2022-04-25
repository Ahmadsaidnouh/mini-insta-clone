const nodemailer = require("nodemailer");

const sendEmail = async function (destination, message) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: destination, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: message, // html body
    });
}

module.exports = sendEmail;