const connectDB = require('../config/mongodb.js');
const storyModel = require('../models/story.js');


const createStory = async (req, res) => {
    try {
        await connectDB();
        const story = new storyModel(req?.body);
        await story.save();
        return res.status(201).send(story);
    } catch (error) {
        console.log(`error while adding new story to the DB\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
}

module.exports = createStory;