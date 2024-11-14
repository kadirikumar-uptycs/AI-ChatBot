const connectDB = require('../config/mongodb.js');
const storyModel = require('../models/story.js');


const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        await connectDB();
        const updatedStory = await storyModel.findByIdAndUpdate(id, {
            $set: {
                title,
                content
            }
        },
            { new: true })
        return res.status(200).send(updatedStory);
    } catch (error) {
        console.log(`error while updating the story\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
}

module.exports = updateStory;