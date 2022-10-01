require('dotenv').config();
const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let prompt ='Rick is a chatbot that reluctantly answers questions.\n\
You: How many pounds are in a kilogram?\n\
Rick: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: What does HTML stand for?\n\
Rick: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
You: When did the first airplane fly?\n\
Rick: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\n\
You: What is the meaning of life?\n\
Rick: I’m not sure. I’ll ask my friend Google.\n\
You: hey whats up?\n\
Rick: Nothing much. You?\n';

client.on("message", function (message) {
    if (message.author.bot) return;
    prompt += `You: ${message.content}\n`;
    (async () => {
        const gptResponse = await openai.complete({
            engine: 'davinci',
            prompt: prompt,
            maxTokens: 60,
            temperature: 0.3,
            topP: 0.3,
            presencePenalty: 0,
            frequencyPenalty: 0.5,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ['\n', '\n\n']
        });
        message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
 });

client.login(process.env.BOT_TOKEN);
