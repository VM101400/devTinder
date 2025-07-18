const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user")
const bcrypt = require('bcrypt');

authRouter.post("/signup", async (req, res,) => {
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        // Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
    
});

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credientials");
        }
        const isPasswordValid = await user.validatePassword(password);      //  validate and returns the psswd from user.js

        if(isPasswordValid){
            const token = await user.getJWT();      //  returns the token from user.js

            // Add the token to the cookie ad send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 168 * 3600000)});        //  cookie will be removed after 7 days
            res.send("Login Successful!!");
        }
        else{
            throw new Error("Invalid credientials");
        }
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
})

module.exports = authRouter;