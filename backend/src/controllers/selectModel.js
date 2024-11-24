const selectModel = async (req, res) => {
    try {
        const { model } = req?.body;
        if (!req?.session?.conversationHistory) {
            return res.status(404).send({ message: 'No conversations found to set preferred model' });
        }
        req.session.conversationHistory.model = model;
        return res.status(200).send(`model selection is successful!`);
    } catch (error) {
        console.log('Server error:', error);
        return res.status(500).send({
            message: error?.response?.data?.message || 'There was an issue choosing the model',
        });
    }
};

module.exports = selectModel;