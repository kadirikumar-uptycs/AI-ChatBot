const ollama = require('ollama');
const clc = require("cli-color");


let info = clc.blue;
let highlight = clc.yellowBright.bgWhiteBright.bold.underline;
const MODELS = ['hf.co/victunes/TherapyLlama-8B-v1-GGUF:Q2_K', 'hf.co/victunes/TherapyLlama-8B-v1-GGUF:Q3_K_M'];
const MAX_MESSAGES = 10;

const reply = async (req, res) => {
    try {
        const { prompt, model } = req.body;

        const choosenModel = (0 <= model && model < MODELS.length) ? MODELS[model] : MODELS.at(-1);

        if (!req?.session?.conversationHistory) {
            req.session.conversationHistory = [{
                role: 'user',
                content: prompt,
            }];
        } else {
            req?.session?.conversationHistory.push({
                role: 'user',
                content: prompt
            });
        }

        if (req?.session?.conversationHistory >= MAX_MESSAGES) {
            return res.status(429).send({ message: 'MAX LIMIT EXCEEDED' });
        }

        const messagesFeed = req?.session?.conversationHistory?.map((item, index) => {
            if (index) return item
            return { ...item, content: `Hi My name is "${req?.user?.name}", ${item.content}` }
        });

        try {
            const response = await ollama.default.chat({
                model: choosenModel,
                messages: messagesFeed,
            },);

            if (response?.message?.content) {
                req.session.conversationHistory.push({
                    role: 'assistant',
                    content: response?.message?.content
                });
            }

            console.log('\n\nModel:', highlight(choosenModel));

            console.log('\nResponse:', info(response?.message?.content));

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