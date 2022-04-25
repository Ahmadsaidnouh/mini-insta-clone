const adminModel = require("../../../DB/models/admin.model");
const userModel = require("../../../DB/models/user.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../common/email.handling");
const CryptoJs = require("crypto-js");
const bcrypt = require("bcrypt");
const reportModel = require("../../../DB/models/report.model");
const postModel = require("../../../DB/models/post.model");

const signUp = async (req, res) => {
    let { adminName, email, password, phone, location } = req.body;
    try {
        const createdsuperAdmin = new adminModel({ adminName, email, password, phone, location });
        const addedSuperAdmin = await createdsuperAdmin.save();
        const token = jwt.sign({ email }, process.env.SECRET_KEY);
        const message = `<a href= "${req.protocol}://${req.headers.host}/admin/confirmEmail/${token}">Click to confirm email.</a>`
        sendEmail(email, message);
        res.json({ message: "SuperAdmin signed up successfully. Note: Confirmation email sent successfully.", addedSuperAdmin });
    } catch (error) {
        res.status(400).json({ message: "(Super)Admin with such email already exists!!", error });
    }
}

const confirmEmail = async (req, res) => {
    let { token } = req.params;
    try {
        let { email } = await jwt.verify(token, process.env.SECRET_KEY);
        const admin = await adminModel.findOne({ email });
        if (admin) {
            if (admin.confirmed) {
                res.json({ message: "Email already confirmed!!" });
            }
            else {
                const updatedAdmin = await adminModel.findByIdAndUpdate(admin._id, { confirmed: true }, { new: true });
                res.json({ message: "Done. Email confirmed successfully!!", user: updatedAdmin });
            }
        }
        else {
            res.status(400).json({ message: "No (super)admin with such email!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid token!!" });
    }
}

const signIn = async (req, res) => {
    let { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (admin) {
        if (admin.confirmed) {
            bcrypt.compare(password, admin.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ id: admin._id, isLoggedIn: true }, process.env.SECRET_KEY);
                    res.json({ message: `Welcome ${admin.adminName}`, token });
                }
                else {
                    res.status(400).json({ message: "Password is incorrect!!" })
                }
            })
        }
        else {
            res.status(400).json({ message: "Email isn't confirmed!!" })
        }
    }
    else {
        res.status(400).json({ message: "No (super)admin with such email!!" })
    }
}

const addAdmin = async (req, res) => {
    let { adminName, email, password, role, phone, location } = req.body;
    let createdBy = req.user._id;
    if (role == "admin") {
        try {
            const createdAdmin = new adminModel({ adminName, email, password, role, phone, location, createdBy });
            const addedAdmin = await createdAdmin.save();
            const token = jwt.sign({ email }, process.env.SECRET_KEY);
            const message = `<a href= "${req.protocol}://${req.headers.host}/admin/confirmEmail/${token}">Click to confirm email.</a>`
            sendEmail(email, message);
            res.json({ message: "Admin added successfully. Note: Confirmation email sent successfully.", addedAdmin });
        } catch (error) {
            res.status(400).json({ message: "(Super)Admin with such email already exists!!", error });
        }
    }
    else {
        res.status(400).json({ message: "Role must be 'admin' only!!" });
    }
}

const getAdminList = async (req, res) => {
    let { page, limit } = req.query;
    if (!page) {
        page = 1;
    }
    if (!limit) {
        limit = 4;
    }
    let skipItems = (page - 1) * limit;

    const allAdmins = await adminModel.find({ role: "admin" }).limit(limit).skip(skipItems);
    res.json({ message: "Done.", allAdmins });
}

const getAllUsers = async (req, res) => {
    let { page, limit } = req.query;
    if (!page) {
        page = 1;
    }
    if (!limit) {
        limit = 4;
    }
    let skipItems = (page - 1) * limit;

    const allUsers = await userModel.find({}).limit(limit).skip(skipItems);
    res.json({ message: "Done.", allUsers });
}

const deleteAdmin = async (req, res) => {
    const { adminId } = req.params;
    try {
        const admin = await adminModel.findOne({ _id: adminId });
        if (admin) {
            const dAdmin = await adminModel.deleteOne({ _id: adminId });
            res.json({ message: "Admin deleted successfully!!", dAdmin });
        }
        else {
            res.status(400).json({ message: "Admin with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Admin with such id doesn't exist!!", error });
    }
}

const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findOne({ _id: userId });
        if (user) {
            const cursor = await postModel.find({createdBy: user._id}).cursor();
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                await reportModel.deleteMany({postId: doc._id})
            }
            await reportModel.deleteMany({ userId })
            await postModel.deleteMany({ createdBy: userId })
            const dUser = await userModel.deleteOne({ _id: userId });
            res.json({ message: "User deleted successfully!!", dUser });
        }
        else {
            res.status(400).json({ message: "User with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "User with such id doesn't exist!!", error });
    }
}

const updateAdmin = async (req, res) => {
    let { adminId, adminName, email, phone, location } = req.body;
    let id = req.user._id;
    phone = CryptoJs.AES.encrypt(phone, process.env.SECRET_KEY).toString();
    try {
        let admin = await adminModel.findOne({ _id: adminId });
        if (admin) {
            let emailNeedsConfirmation = (email != admin.email);
            if (emailNeedsConfirmation) {
                try {
                    const updatedAdmin = await adminModel.findByIdAndUpdate(adminId, { adminName, email, phone, location, confirmed: false }, { new: true });
                    const token = jwt.sign({ email }, process.env.SECRET_KEY);
                    const message = `<a href= "${req.protocol}://${req.headers.host}/admin/confirmEmail/${token}">Click to confirm email.</a>`
                    sendEmail(email, message);
                    res.json({ message: "Profile updated successfully. Note: Confirmation email sent successfully.", updatedAdmin });
                } catch (error) {
                    res.status(400).json({ message: "(Super)Admin with such email already exists!!", error })
                }
            }
            else {
                const updatedAdmin = await adminModel.findByIdAndUpdate(adminId, { adminName, phone, location }, { new: true });
                res.json({ message: "Profile updated successfully!!", updatedAdmin });
            }
        }
        else {
            res.status(400).json({ message: "Admin with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Admin with such id doesn't exist!!" });
    }
}

const blockUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findOne({ _id: userId });
        if (user) {
            if (user.accountBlocked) {
                res.json({ message: "Account already blocked!!" })
            }
            else {
                const updatedUser = await userModel.findByIdAndUpdate(user._id, { accountBlocked: true }, { new: true });
                res.json({ message: "Account blocked successfully!!", updatedUser })
            }
        }
        else {
            res.status(400).json({ message: "User with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "User with such id doesn't exist!!" });
    }
}

const unBlockUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findOne({ _id: userId });
        if (user) {
            if (user.accountBlocked) {
                const updatedUser = await userModel.findByIdAndUpdate(user._id, { accountBlocked: false }, { new: true });
                res.json({ message: "Account unblocked successfully!!", updatedUser })
            }
            else {
                res.json({ message: "Account already not blocked!!" })
            }
        }
        else {
            res.status(400).json({ message: "User with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "User with such id doesn't exist!!" });
    }
}

const getAdminById = async (req, res) => {
    let { adminId } = req.params;
    try {
        const admin = await adminModel.findOne({ _id: adminId });
        if (admin) {
            res.json({ message: "Done", admin });
        }
        else {
            res.status(400).json({ message: "Admin with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Admin with such id doesn't exist!!", error });
    }
}

const getUserById = async (req, res) => {
    let { userId } = req.params;
    try {
        const user = await userModel.findOne({ _id: userId });
        if (user) {
            res.json({ message: "Done", user });
        }
        else {
            res.status(400).json({ message: "User with such id doesn't exist!!" });
        }
    } catch (error) {
        res.status(400).json({ message: "User with such id doesn't exist!!", error });
    }
}

const searchUserByNameLike = async (req, res) => {
    let { name } = req.params;
    const users = await userModel.find({ userName: { $regex: `${name}` } });
    if (users.length) {
        res.json({ message: "Done.", users });
    }
    else {
        res.status(400).json({ message: "No users with such specification!!" })
    }
}


module.exports = {
    signUp,
    confirmEmail,
    signIn,
    addAdmin,
    getAdminList,
    getAllUsers,
    deleteAdmin,
    deleteUser,
    updateAdmin,
    blockUser,
    unBlockUser,
    getAdminById,
    getUserById,
    searchUserByNameLike
}