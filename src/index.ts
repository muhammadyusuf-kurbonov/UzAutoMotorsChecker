import fs from "fs";
import CheckRunner from "./runner";

const lockFile = "checker.lock";

if (fs.existsSync(lockFile)) {
  console.log("Checker is already running...");
  process.exit();
}

async function main() {
  fs.writeFileSync(lockFile, "");

  const runner = new CheckRunner();

  while (true) {
    await runner.runWorkflow();

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

process.stdin.resume(); // so the program will not close instantly

function exitHandler() {
  if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
  process.exit();
}

// do something when app is closing
process.on("exit", exitHandler.bind(null));

// catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null));
process.on("SIGUSR2", exitHandler.bind(null));

// catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null));

main();
