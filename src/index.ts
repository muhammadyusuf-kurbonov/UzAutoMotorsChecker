import fs from "fs";
import CheckRunner from "./runner";
import arg from 'arg';

const lockFile = "checker.lock";

if (fs.existsSync(lockFile)) {
  console.log("Checker is already running...");
  process.exit();
}

async function main(interval: number = 10_000, timeout = 15_000) {
  fs.writeFileSync(lockFile, "");

  const runner = new CheckRunner();

  while (true) {
    await runner.runWorkflow(timeout);

    await new Promise((resolve) => setTimeout(resolve, interval));
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

const args = arg({
  '--interval': Number,
  '--timeout': Number,

  '--help': Boolean
});

if (args["--help"]) {
  console.log(`
  
  This app checks for models of UzAutoMotors from its website
  
  Syntax:
  checker [--interval 10000 | --timeout 15000]

  Arguments:
  interval - millisecods between checks

  timeout - milliseconds to wait before connection established.
  `);
  process.exit(0);
}

main(
  args["--interval"],
  args["--timeout"]
);
