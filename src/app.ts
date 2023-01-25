import { Client, LocalAuth } from "whatsapp-web.js";
import { Configuration, OpenAIApi } from "openai";
import qrcode from "qrcode-terminal";
import axios from "axios";

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth({
    clientId: "BEM-STTNF",
    dataPath: __dirname + "/session",
  }),
});

const { API_KEY } = require("dotenv").config().parsed;

const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: msg.body,
      max_tokens: 1000,
      temperature: 0.9,
    });

    console.log(msg.body);
    console.log(completion.data.choices[0].text);
    msg.reply(String(completion.data.choices[0].text));
  } catch (err) {
    console.log(err);
    msg.reply("Sorry, Request failed.");
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.on("authenticated", (session) => {
  console.log("Client was authenticated");
});

client.initialize();
