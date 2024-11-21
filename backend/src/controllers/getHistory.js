const getHistory = async (req, res) => {
    try {
        return res.status(200).send(req?.session?.conversationHistory || [])
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send({
            message: error?.response?.data?.message || 'There was an issue fetching the conversation history',
        });
    }
};

module.exports = getHistory