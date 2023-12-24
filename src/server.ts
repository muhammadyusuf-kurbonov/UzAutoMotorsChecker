import http from "http";
import CheckRunner from "./runner";

http
  .createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`);

    const runner = new CheckRunner();

    runner.sendMessagesFromTelegram('Начало проверки ...');

    runner.runWorkflow();

    res.write("Done!");
    res.end();
  })
  .listen(process.env.PORT || 3000);
