const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Undone", "Done"],
        default: "Undone" // Set the default status to "Undone"
    },
    date: {
        type: Date,
        required: true
    }
});


const todo = mongoose.model("todo", todoSchema)
module.exports = todo