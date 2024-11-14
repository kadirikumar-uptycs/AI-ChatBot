const connectDB = require('../config/mongodb.js');
const storyModel = require('../models/story.js');


const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        await connectDB();
        await storyModel.findByIdAndDelete(id);
        return res.status(200).send('Deleted Successfully!');
    } catch (error) {
        console.log(`error while deleting story from the DB\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
}

module.exports = deleteStory;