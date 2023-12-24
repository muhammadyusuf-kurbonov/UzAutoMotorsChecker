var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import CheckRunner from "./runner";
const lockFile = "checker.lock";
if (fs.existsSync(lockFile)) {
    console.log("Checker is already running...");
    process.exit();
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        fs.writeFileSync(lockFile, "");
        const runner = new CheckRunner();
        while (true) {
            yield runner.runWorkflow();
            yield new Promise((resolve) => setTimeout(resolve, 10000));
        }
    });
}
process.stdin.resume(); // so the program will not close instantly
function exitHandler() {
    if (fs.existsSync(lockFile))
        fs.unlinkSync(lockFile);
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
