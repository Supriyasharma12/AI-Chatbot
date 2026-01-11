const mongoose = require("mongoose");

const UserMemorySchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        default: ""
    },
    interests:{
        type: String,
        default: ""
    },
    memorySummary: {
        type:String,
        default: ""
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UserMemory", UserMemorySchema);