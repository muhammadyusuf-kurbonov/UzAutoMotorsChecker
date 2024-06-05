import fs from "fs";
import CheckRunner from "./runner";
import arg from 'arg';

const lockFile = "checker.lock";

const args = arg({
  "--interval": Number,
  "--timeout": Number,

  "--help": Boolean,
  "--ignore-lock": Boolean,
});

if (args["--help"]) {
  console.log(`
  
  This app checks for models of UzAutoMotors from its website
  
  Syntax:
  checker [--interval 10000 | --timeout 15000 | --ignore-lock]

  Arguments:
  interval - millisecods between checks

  timeout - milliseconds to wait before connection established.

  ignore-lock - ignore lock file.
  `);
  process.exit(0);
}

if (!args["--ignore-lock"] && fs.existsSync(lockFile)) {
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

main(
  args["--interval"],
  args["--timeout"]
);
