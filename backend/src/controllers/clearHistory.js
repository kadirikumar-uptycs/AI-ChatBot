const clearHistory = async (req, res) => {
    try {
        if (req?.session?.conversationHistory) req.session.conversationHistory = null;
        return res.status(200).send('Done!');
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send({
            message: error?.response?.data?.message || 'There was an issue clearing the conversation history',
        });
    }
};

module.exports = clearHistory