const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const validatePassword = require("../models/user")
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async(req, res) => {

    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        
        await loggedInUser.save();
        res.json({message :`${loggedInUser.firstName}, your profile updated successfully!!`, data: loggedInUser});
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const {currentPassword, newPassword} = req.body;
        if(!currentPassword || !newPassword){
            throw new Error("Both passwords are required!!")
        }else if(currentPassword === newPassword){
            throw new Error("Current password and New password should not be same!!")
        }
        const user = req.user;
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){
            res.status(400).send("Current Password is incorrect");
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send("Password Updated Successfully!!");
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
module.exports = profileRouter;