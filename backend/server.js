const express = require ('express');
const mongoose = require("mongoose");
const cors= require ("cors");
const { config } = require('dotenv');
require("dotenv").config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

//adding chat.js to main server
const chatRoute = require ("../backend/routes/chat");
app.use("/chat",chatRoute);

//connect mongodb
// console.log("MONGO_URI CHECK:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("mongodb atlas connected");
    })
    .catch(err => console.error("MongoDB error:",err));

//test route
app.get("/", (req,res) => {
    req.send("Server is running");
});



//start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
