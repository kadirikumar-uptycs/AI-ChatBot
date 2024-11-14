const ollama = require('ollama');

const reply = async (req, res) => {
    try {
        const { prompt } = req.body;

        const { firstMessage } = req.query;

        if (!req?.session?.conversationHistory || firstMessage == 'true') {
            req.session.conversationHistory = [{
                role: 'user',
                content: `Hi My name is "${req?.user?.name}" ${prompt}`,
            }];
        } else {
            req?.session?.conversationHistory.push({
                role: 'user',
                content: prompt
            });
        }

        try {
            const response = await ollama.default.chat({
                model: 'hf.co/victunes/TherapyLlama-8B-v1-GGUF:Q2_K',
                messages: req?.session?.conversationHistory,
            });

            if (response?.message?.content) {
                req.session.conversationHistory.push({
                    role: 'assistant',
                    content: response?.message?.content
                });
            }

            console.log(response?.message?.content);

            return res.status(200).send({ message: response?.message?.content });

        } catch (error) {
            console.error('Ollama interaction error:', error);
            return res.status(500).send({ message: error?.message || 'Error interacting with the model' });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send({
            message: error?.response?.data?.message || 'There was an issue connecting to the Model. Please try again later',
        });
    }
};

module.exports = reply