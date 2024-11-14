const connectDB = require('../config/mongodb.js');
const storyModel = require('../models/story.js');


const fetchStories = async (_, res) => {
    try {
        await connectDB();
        const stories = await storyModel.find({}).sort({ createdAt: -1 });
        return res.status(200).send(stories);
    } catch (error) {
        console.log(`error while fetching stories from the DB\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
}

module.exports = fetchStories;