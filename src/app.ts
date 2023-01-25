import { Client, LocalAuth } from "whatsapp-web.js";
import { Configuration, OpenAIApi } from "openai";
import qrcode from "qrcode-terminal";

/**
 * @description Create a new client instance for the WhatsApp Web API
 */
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID",
    dataPath: __dirname + "/session",
  }),
});

/**
 * @description Create a new client instance for the OpenAI API
 */
const { API_KEY_OPENAI } = require("dotenv").config().parsed;

const configuration = new Configuration({
  apiKey: API_KEY_OPENAI,
});

const openai = new OpenAIApi(configuration);

/**
 * @description Generate a QR code to authenticate the client
 */
client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });

  console.log("Scan the QR code above to authenticate the client !!!");
});

/**
 * @description Log the client is ready
 */
client.on("ready", () => {
  console.log("Client is ready!");
});

/**
 * @description Log the client in listening messages
 */
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

/**
 * @description Log the client is logged out
 */
client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

/**
 * @description Log the client is authenticated
 */
client.on("authenticated", (session) => {
  console.log("Client was authenticated");
});

/**
 * @description Initialize the client WhatsApp Web API
 */
client.initialize();
