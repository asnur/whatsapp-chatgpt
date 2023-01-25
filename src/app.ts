import { Client, LocalAuth } from "whatsapp-web.js";
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

client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  axios
    .post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: msg.body,
        temperature: 1,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    )
    .then((res) => {
      msg.reply(res.data.choices[0].text);
    });
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.on("authenticated", (session) => {
  console.log("Client was authenticated");
});

client.initialize();
