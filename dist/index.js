"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
let found = false;
async function sendMessagesFromTelegram(message, silent = false) {
    const receivers = ["2041083582", "378726781"];
    return await Promise.all(receivers.map((chat_id) => axios_1.default.post("https://api.telegram.org/bot1277981233:AAGmIiZiSf6zK3J-SWyul7Q7dz3lZUzOpTo/sendMessage", { chat_id, text: message, disable_notification: silent })));
}
function isResponseSuccessful(response) {
    return response?.status !== 200;
}
async function runWorkflow() {
    console.log("Processing...");
    let failed = false;
    const response = await axios_1.default.post("https://savdo.uzavtosanoat.uz/b/ap/stream/ph&models", {
        filial_id: 100,
        is_web: "Y",
    }, {
        timeout: 15000
    })
        .catch((error) => {
        failed = true;
        console.error(error);
        return null;
    });
    console.log('Fetched');
    failed = !isResponseSuccessful(response);
    if (failed) {
        sendMessagesFromTelegram("Network error");
        return;
    }
    const damasIsAvailable = response?.data.find((model) => model.name.includes("DAMAS"));
    if (damasIsAvailable) {
        sendMessagesFromTelegram("DAMAS chiqdi");
        console.log('FOUND!');
        found = true;
    }
    else {
        sendMessagesFromTelegram("Kutyabmiz", true);
    }
}
runWorkflow();
setInterval(() => runWorkflow(), 10000);
while (!found) { }
