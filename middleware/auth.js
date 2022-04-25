const jwt = require("jsonwebtoken");
const userModel = require("../DB/models/user.model");

const auth = (type, collectionModel,data) => {
    return async (req, res, next) => {
        const tokenHeader = req.headers["authorization"];
        if(tokenHeader) {
            if (tokenHeader.startsWith("Bearer")) {
                const token = tokenHeader.split(" ")[1];
                try {
                    const user = jwt.verify(token, process.env.SECRET_KEY);
                    if(user.isLoggedIn) {
                        try {
                            const findUser = await collectionModel.findOne({_id: user.id});
                            if(findUser) {
                                if(findUser.confirmed) {
                                    if(collectionModel == userModel) {
                                        if(findUser.accountBlocked) {
                                            res.status(400).json({message: "Can't continue action. User is blocked by an admin or superAdmin!!"})
                                        }
                                        else {
                                            if(data.includes(findUser.role)) {
                                                req.user = findUser;
                                                next();
                                            }
                                            else {
                                                res.status(400).json({message: "Unauthorized action!!"})
                                            }
                                        }
                                    }
                                    else {
                                        if(data.includes(findUser.role)) {
                                            req.user = findUser;
                                            next();
                                        }
                                        else {
                                            res.status(400).json({message: "Unauthorized action!!"})
                                        }
                                    }
                                }
                                else {
                                    res.status(400).json({message: `${type} email isn't confirmed!!`})
                                }
                            }
                            else {
                                res.status(400).json({message: `${type} with such id doesn't exist!!`})
                            }
                        } catch (error) {
                            res.status(400).json({message: `${type} with such id doesn't exist!!`, error})
                        }
                    }
                    else {
                        res.status(400).json({message: `${type} isn't logged in!!`})
                    }
                } catch (error) {
                    res.status(400).json({message: 'Invalid token!!'})
                }
            }
            else {
                res.status(400).json({message: 'Invalid token!!'})
            }
        }
        else {
            res.status(400).json({message: 'Invalid token!!'})
        }
    }
}

module.exports = auth;