/*
 * @Author: BATU1579
 * @CreateDate: 2022-02-04 21:03:08
 * @LastEditor: BATU1579
 * @LastTime: 2022-09-23 17:41:05
 * @FilePath: \\src\\global.ts
 * @Description: 全局常量和配置项验证
 */

import { ConfigInvalidException } from "./lib/exception";
import { LogLevel, logStack, Record, sendLog, setToken } from "./lib/logger";

export const PROJECT_NAME = "智慧树助手"

/**
 * @description: 脚本版本号。建议根据 [语义化版本号] 迭代
 */
export const VERSION = "0.1.0";

export const LISTENER_INTERVAL = 100;

export const SHORT_WAIT_MS = 300;

export const LONG_WAIT_MS = 1000;

export const EVENT = events.emitter();

Record.info(`Launching...\n\n\tCurrent script version: ${VERSION}\n`);

// ---------------------- configuration -------------------------

const {
    _MODE,
    _TOKEN,
    _SHOW_CONSOLE,
} = hamibot.env;

// -------------------- register listener -----------------------

// register exit listener
events.on("exit", () => {
    threads.shutDownAll();
    Record.info("Exit...");

    sleep(LONG_WAIT_MS * 5);
    console.hide();

    // send to pushplus
    let collection = logStack.filter((frame) => {
        return frame.getLevel() >= LogLevel.Log;
    });

    if (_TOKEN && _TOKEN !== "") {
        Record.info("Sending logs to pushplus...");

        for (let i = 0; i < 3; i++) {
            if (sendLog(collection, `[LOG] ${PROJECT_NAME}`)) {
                Record.info("Sending logs succeeds");
                return;
            }
            Record.warn(`Sending failed, retry ${i + 1}`);
        }

        Record.error("Failure to send logs !");
    }
});

// ------------------------ validation --------------------------

Record.info("Verifying configurations");

// script mode
export enum RunMode {
    auto = "auto",
    manual = "manual"
}

if (_MODE !== RunMode.auto && _MODE !== RunMode.manual) {
    throw new ConfigInvalidException("Invalid script mode", "needs to be 'auto' or 'manual'");
}
export const MODE = _MODE as RunMode;

// pushplus token
if (_TOKEN && _TOKEN !== "" && setToken(_TOKEN) == false) {
    throw new ConfigInvalidException("pushplus token", "needs to be a 32-bit hexadecimal number");
}
export const TOKEN = _TOKEN as string | undefined;

// show console
if (typeof _SHOW_CONSOLE !== "string" || _SHOW_CONSOLE !== "true" && _SHOW_CONSOLE !== "false") {
    throw new ConfigInvalidException("show console");
}
export const SHOW_CONSOLE = _SHOW_CONSOLE as "true" | "false";
