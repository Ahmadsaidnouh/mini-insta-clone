const userModel = require("../../../DB/models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../../../common/email.handling");
const CryptoJs = require("crypto-js");
const postModel = require("../../../DB/models/post.model");
const reportModel = require("../../../DB/models/report.model");


const signUp = async (req, res) => {
    let { userName, email, password, phone, location } = req.body;
    try {
        const createdUser = new userModel({ userName, email, password, phone, location });
        const addedUser = await createdUser.save();
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 60 });
        const message = `<a href= "${req.protocol}://${req.headers.host}/user/confirmEmail/${token}">Click to confirm email.</a>`
        sendEmail(email, message);
        res.json({ message: "User signed up successfully. Note: Confirmation email sent successfully(expires within one minute).", addedUser });
    } catch (error) {
        res.status(400).json({ message: "User with such email already exists!!", error });
    }
}

const confirmEmail = async (req, res) => {
    let { token } = req.params;
    try {
        let { email } = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await userModel.findOne({ email });
        if (user) {
            if (user.confirmed) {
                res.json({ message: "Email already confirmed!!" });
            }
            else {
                const updatedUser = await userModel.findByIdAndUpdate(user._id, { confirmed: true }, { new: true });
                res.json({ message: "Done. Email confirmed successfully!!", user: updatedUser });
            }
        }
        else {
            res.status(400).json({ message: "No user with such email!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid token!!" });
    }
}

const signIn = async (req, res) => {
    let { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        if (user.confirmed) {
            if (user.accountBlocked) {
                res.status(400).json({ message: "Can't signIn. User is blocked by an admin or superAdmin!!" })
            }
            else {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.SECRET_KEY);
                        res.json({ message: `Welcome ${user.userName}`, token });
                    }
                    else {
                        res.status(400).json({ message: "Password is incorrect!!" })
                    }
                })
            }
        }
        else {
            res.status(400).json({ message: "Email isn't confirmed!!" })
        }
    }
    else {
        res.status(400).json({ message: "No user with such email!!" })
    }
}

const updateProfile = async (req, res) => {
    let { userName, email, phone, location } = req.body;
    let id = req.user._id;
    phone = CryptoJs.AES.encrypt(phone, process.env.SECRET_KEY).toString();
    try {
        let emailNeedsConfirmation = (email != req.user.email);
        if (emailNeedsConfirmation) {
            const updatedUser = await userModel.findByIdAndUpdate(id, { userName, email, phone, location, confirmed: false }, { new: true });
            const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 60 });
            const message = `<a href= "${req.protocol}://${req.headers.host}/user/confirmEmail/${token}">Click to confirm email.</a>`
            sendEmail(email, message);
            res.json({ message: "Profile updated successfully. Note: Confirmation email sent successfully(expires within one minute).", updatedUser });
        }
        else {
            const updatedUser = await userModel.findByIdAndUpdate(id, { userName, phone, location }, { new: true });
            res.json({ message: "Profile updated successfully!!", updatedUser });
        }
    } catch (error) {
        res.status(400).json({ message: "User with such email already exists!!", error })
    }
}

const updatePassword = async (req, res) => {
    let { oldPassword, newPassword } = req.body;
    let id = req.user._id;
    bcrypt.compare(oldPassword, req.user.password, function (err, result) {
        if (result) {
            bcrypt.hash(newPassword, parseInt(process.env.SALT), async (err, hash) => {
                const updatedUser = await userModel.findByIdAndUpdate(id, { password: hash }, { new: true });
                res.json({ message: "Password updated successfully!!", updatedUser });
            })
        }
        else {
            res.status(400).json({ message: "OldPassword is incorrect!!" })
        }
    })
}

const forgetPassword = async (req, res) => {
    let { email } = req.body;
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 60 });
    const message = `<a href= "${req.protocol}://${req.headers.host}/forgetPasswordConfirmEmail/${token}">Click to  generate new password.</a>`
    sendEmail(email, message);
    res.json({ message: "Confirmation email sent successfully. Note: email will expire within one minute!!" });
}

const forgetPasswordConfirmEmail = async (req, res) => {
    let { token } = req.params;
    try {
        let { email } = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await userModel.findOne({ email });
        if (user) {
            let newPassword = "1a2b3c4d";
            user.password = bcrypt.hashSync(newPassword, parseInt(process.env.SALT));
            const updatedUser = await userModel.findByIdAndUpdate(user._id, { password: user.password }, { new: true });
            res.json({ message: "NewPassword generated and oldPassword updated successfully. Note: you can signIn with your email & this new password and then udpate your password using '/user/updatePassword' api", newPassword, updatedUser });
        }
        else {
            res.status(400).json({ message: "No user with such email!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid token!!" });
    }
}

const deactivateAccount = async (req, res) => {
    if (req.user.accountActive == false) {
        res.json({ message: "Account already deactivated!!" })
    }
    else {
        const user = await userModel.findByIdAndUpdate(req.user._id, { accountActive: false }, { new: true });
        res.json({ message: "Account deactivated successfully!!", user });
    }
}

const activateAccount = async (req, res) => {
    if (req.user.accountActive == true) {
        res.json({ message: "Account already activated!!" })
    }
    else {
        const user = await userModel.findByIdAndUpdate(req.user._id, { accountActive: true }, { new: true });
        res.json({ message: "Account activated successfully!!", user });
    }
}

const viewProfile = async (req, res) => {
    res.json({ message: "Done", user: req.user });
}

const sendConfirmationEmail = async (req, res) => {
    let { email } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        if (user.confirmed) {
            res.json({ message: "Email already confirmed!!" });
        }
        else {
            const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: 60 });
            const message = `<a href= "${req.protocol}://${req.headers.host}/user/confirmEmail/${token}">Click to confirm email.</a>`
            sendEmail(email, message);
            res.json({ message: "Confirmation email sent successfully(expires within one minute)!!" });
        }
    }
    else {
        res.status(400).json({ message: "No user with such email!!" });
    }
}

const deletePost = async (req, res) => {
    let { postId } = req.body;
    let user = req.user;
    try {
        let post = await postModel.findOne({ _id: postId });
        if (post) {
            if (!post.createdBy.equals(user._id)) {
                res.status(400).json({ message: "Unauthorized action ... not post owner!!" });
            }
            else {
                await reportModel.deleteMany({ postId });
                const dPost = await postModel.deleteOne({ _id: postId });
                res.json({ message: "Post deleted successfully!!", dPost });
            }
        }
        else {
            res.status(400).json({ message: "Post with such id doesn't exist!!" })
        }
    } catch (error) {
        res.status(400).json({ message: "Post with such id doesn't exist!!", error })
    }
}

const getUserProfilePosts = async (req, res) => {
    let user = req.user;
    try {
        const posts = await postModel.find({ createdBy: user._id }).populate([{
            path: "createdBy",
            model: "user",
            select: "userName"
        }]);
        if (posts.length) {
            res.json({ message: "Done", userPosts: posts });
        }
        else {
            res.status(400).json({ message: "User didn't create posts yet!!" })
        }
    } catch (error) {
        res.json({ message: "UserId is in-valid!!", error });
    }
}


module.exports = {
    signUp,
    confirmEmail,
    signIn,
    updateProfile,
    updatePassword,
    forgetPassword,
    forgetPasswordConfirmEmail,
    deactivateAccount,
    activateAccount,
    viewProfile,
    sendConfirmationEmail,
    deletePost,
    getUserProfilePosts
}