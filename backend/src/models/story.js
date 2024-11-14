const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const storyModel = mongoose.model('Story', storySchema);

module.exports = storyModel;