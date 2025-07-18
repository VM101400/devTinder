const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // referrence to the User Collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
           values: ["ignored", "interested", "accepted", "rejected"],
           message: `{VALUE} is incorrect status type`
        }
    }
},{ timestamps: true }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});  // compound index
// val 4
// This method will call before calling the connectionRequest.save() function in request.js
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    // Check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!!");
    }
    next();
})


const ConnectionRequestModel = new mongoose.model( "connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;