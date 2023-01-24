import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.on("authenticated", (session) => {
  console.log("Client authenticated");
});

client.initialize();
