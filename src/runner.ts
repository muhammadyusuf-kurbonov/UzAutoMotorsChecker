import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";
import { AutoModel } from "./dtos";

export default class CheckRunner {
  message_ids: { chat_id: string; msg_id: number }[] | null = null;

  async sendMessagesFromTelegram(message: string, notify: boolean = false) {
    const receivers = ["2041083582", "378726781", "6052804899"];
    // const receivers = ["378726781"];

    const fullMessage = `
  ${message}

  at ${format(new Date(), "ppp")}
  `;

    let messageResponses;
    if (this.message_ids !== null && !notify) {
      messageResponses = await Promise.all(
        this.message_ids.map((msg) =>
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
      this.message_ids === null &&
      messageResponses.every((res) => this.isResponseSuccessful(res))
    ) {
      this.message_ids = messageResponses.map((result, index) => ({
        chat_id: receivers[index],
        msg_id: result.data.result.message_id,
      }));
    }
  }

  isResponseSuccessful(
    response: AxiosResponse<AutoModel[]> | null
  ): response is AxiosResponse<AutoModel[]> {
    return response?.status === 200;
  }

  async runWorkflow(timeout: number = 15_000) {
    console.log("Processing...");
    let failed = false;
    const response = await axios
      .post<AutoModel[]>(
        "https://savdo.uzavtosanoat.uz/b/ap/stream/ph&models",
        {
          filial_id: 100,
          is_web: "Y",
        },
        {
          timeout,
          headers: {
            Cookie: "lang=ru; JSESSIONID=50ADF0A7A8B67D7423F2340D54B02C71",
            Filial_id: 100,
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          },
        }
      )
      .catch((error) => {
        failed = true;
        console.error(error.message);
        return null;
      });

    console.log("Fetched", response?.status === 200 ? response?.data.map(car => car.name) : response?.status);

    failed = !this.isResponseSuccessful(response);

    if (failed) {
      this.sendMessagesFromTelegram("Baza ishlamayapti...");
      return;
    }

    const damasIsAvailable = response?.data.find(
      (model) =>
        model.name.includes("DAMAS") ||
        model.name.includes("COBALT") ||
        model.name.includes("LACETTI")
    );

    if (damasIsAvailable) {
      this.sendMessagesFromTelegram("Zakaz chiqdi!!!", true);
      console.log("FOUND!");
    } else {
      this.sendMessagesFromTelegram("Kutyabmiz");
    }
  }
}
