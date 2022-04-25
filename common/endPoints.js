const appRoles = {
    User: "user",
    Admin: "admin",
    SuperAdmin: "superAdmin"
}

const endPoints = {
    userAuth: [appRoles.User],
    superAdminAuth: [appRoles.SuperAdmin],
    adminAuth: [appRoles.Admin],
    superAdminOrAdminAuth: [appRoles.SuperAdmin, appRoles.Admin],
}

module.exports = endPoints;