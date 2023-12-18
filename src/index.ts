import axios, { AxiosResponse } from "axios";
import { AutoModel } from "./dtos";
import {format} from 'date-fns';

let found = false;
let message_ids: { chat_id: string; msg_id: number }[] | null = null;

async function sendMessagesFromTelegram(
  message: string,
  notify: boolean = false
) {
  const receivers = ["2041083582", "378726781", "6052804899"];

  const fullMessage = `
  ${message}

  at ${format(new Date(), "ppp")}
  `;

  

  let messageResponses;
  if (message_ids !== null && !notify) {
    messageResponses = await Promise.all(
      message_ids.map((msg) =>
        axios.post(
          "https://api.telegram.org/bot1277981233:AAGmIiZiSf6zK3J-SWyul7Q7dz3lZUzOpTo/editMessageText",
          { chat_id: msg.chat_id, message_id: msg.msg_id, text: fullMessage }
        )
      )
    );
  } else {
    messageResponses = await Promise.all(
      receivers.map((chat_id) =>
        axios.post(
          "https://api.telegram.org/bot1277981233:AAGmIiZiSf6zK3J-SWyul7Q7dz3lZUzOpTo/sendMessage",
          { chat_id, text: fullMessage }
        )
      )
    );
  }

  if (
    message_ids === null &&
    messageResponses.every((res) => isResponseSuccessful(res))
  ) {
    message_ids = messageResponses.map((result, index) => ({
      chat_id: receivers[index],
      msg_id: result.data.result.message_id,
    }));

    console.log(message_ids);
  }
}

function isResponseSuccessful(
  response: AxiosResponse<AutoModel[]> | null
): response is AxiosResponse<AutoModel[]> {
  return response?.status === 200;
}

async function runWorkflow() {
  console.log("Processing...");
  let failed = false;
  const response = await axios
    .post<AutoModel[]>(
      "https://savdo.uzavtosanoat.uz/b/ap/stream/ph&models",
      {
        filial_id: 100,
        is_web: "N",
      },
      {
        timeout: 15000,
      }
    )
    .catch((error) => {
      failed = true;
      console.error(error.message);
      return null;
    });

  console.log("Fetched", response?.status);

  failed = !isResponseSuccessful(response);

  if (failed) {
    sendMessagesFromTelegram("Baza ishlamayapti...");
    return;
  }

  const damasIsAvailable = response?.data.find(
    (model) =>
      model.name.includes("DAMAS") ||
      model.name.includes("COBALT") ||
      model.name.includes("LACETTI")
  );

  if (damasIsAvailable) {
    sendMessagesFromTelegram("Zakaz chiqdi!!!", true);
    console.log("FOUND!");
    found = true;
  } else {
    sendMessagesFromTelegram("Kutyabmiz");
  }
}

while (!found) {
  await runWorkflow();

  await new Promise((resolve) => setTimeout(resolve, 10000));
}
