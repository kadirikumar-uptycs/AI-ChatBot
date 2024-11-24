const ollama = require('ollama');
const clc = require("cli-color");


let info = clc.blue;
let highlight = clc.yellowBright.bgWhiteBright.bold.underline;
const MODELS = ['hf.co/victunes/TherapyLlama-8B-v1-GGUF:Q3_K_M', 'hf.co/victunes/TherapyLlama-8B-v1-GGUF:Q2_K'];
const MAX_MESSAGES = 10;

const reply = async (req, res) => {
    try {
        const { prompt, model } = req.body;

        const choosenModels = model <= -1 ? [...MODELS] : [MODELS[model]];

        const modelResponses = [];

        if (!req?.session) return res.status(401).send({ message: 'Unauthorized' });

        req.session.conversationHistory ??= {
            model,
            messages: [],
        };

        req?.session?.conversationHistory?.messages.push({
            role: 'user',
            content: prompt
        });

        if (req?.session?.conversationHistory?.messages >= MAX_MESSAGES) {
            return res.status(429).send({ message: 'MAX LIMIT EXCEEDED. START NEW CHART' });
        }


        for (let index = 0; index < choosenModels.length; index++) {

            let messagesFeed = req?.session?.conversationHistory?.messages?.map((item, index) => {
                if (!index) return { ...item, content: `Hi My name is "${req?.user?.name}", ${item.content}` }
                if (item?.role === 'user') return item
                return {
                    ...item,
                    content: item?.content[index] || item?.content[0],
                }
            });

            try {
                const response = await ollama.default.chat({
                    model: choosenModels[index],
                    messages: messagesFeed,
                },);

                modelResponses.push(response?.message?.content)


                console.log('\n\nModel:', highlight(choosenModels[index]));

                console.log('\nResponse:', info(response?.message?.content));


            } catch (error) {
                console.error('Ollama interaction error:', error);
                return res.status(500).send({ message: error?.message || 'Error interacting with the model' });
            }
        }
        req.session.conversationHistory.messages.push({
            role: 'assistant',
            content: modelResponses
        });
        return res.status(200).send({ content: modelResponses });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send({
            message: error?.response?.data?.message || 'There was an issue connecting to the Model. Please try again later',
        });
    }
};

module.exports = reply