const express = require('express')
require("dotenv").config();
const app = express()
const port = process.env.PORT;
const { userRoutes, adminRoutes, postRoutes, reportRoutes } = require("./routes/allroutes");
const initConnection = require("./DB/config");

app.use(express.json());
app.use(userRoutes, adminRoutes, postRoutes, reportRoutes);
initConnection();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))