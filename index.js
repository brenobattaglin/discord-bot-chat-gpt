require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log("ChatGPT bot is online on Discord!");
});

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
  commands: {
    name: "gpt",
    description: "Ask a question for the ChatGPT bot",
  },
});

const openai = new OpenAIApi(configuration);

client.on(Events.MessageCreate, async function (message) {
  try {
    if (message.author.bot) return;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `ChatGPT is a friendly chatbot. \n\
      ${message.author.username}: ${message.content}\n\
      ChatGPT:`,
      temperature: 0.9,
      max_tokens: 100,
      stop: [process.env.BOT_NAME, process.env.DISCORD_USERNAME],
    });
    console.log(message.content);
    message.reply(`${response.data.choices[0].text}`);
    return;
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.DISCORD_TOKEN);
