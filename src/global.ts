/*
 * @Author: BATU1579
 * @CreateDate: 2022-02-04 21:03:08
 * @LastEditor: BATU1579
 * @LastTime: 2022-12-06 02:40:38
 * @FilePath: \\src\\global.ts
 * @Description: 全局常量和配置项验证
 */

import { ConfigInvalidException } from "./lib/exception";
import { LogLevel, logStack, Record, sendLog, setToken } from "./lib/logger";

export const PROJECT_NAME = "智慧树助手"

/**
 * @description: 脚本版本号。建议根据 [语义化版本号] 迭代
 */
export const VERSION = "1.1.0";

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
    _SWIPE_DIRECTION,
    _UNLOCK_PWD,
    _CLASS_NAME,
    _STUDY_TIME_MIN,
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

    hamibot.exit();
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

// swipe direction
const directionOptions = [
    "toLeft",
    "toRight",
    "toTop",
    "toBottom"
] as const;

type Direction = typeof directionOptions[number];

if (
    MODE === RunMode.auto &&
    (
        typeof _SWIPE_DIRECTION !== "string" ||
        directionOptions.indexOf(_SWIPE_DIRECTION as Direction) === -1
    )
) {
    throw new ConfigInvalidException("swipe direction");
}
export const SWIPE_DIRECTION = _SWIPE_DIRECTION as Direction;

// unlock password
if (
    MODE === RunMode.auto &&
    (
        typeof _UNLOCK_PWD !== "string" ||
        !(/^\d*$/.test(_UNLOCK_PWD))
    )
) {
    throw new ConfigInvalidException("unlock password", "currently, only digits password are supported");
}
export const UNLOCK_PWD = _UNLOCK_PWD as string | undefined;

// class name
if (
    MODE === RunMode.auto &&
    (
        typeof _CLASS_NAME !== "string" ||
        _CLASS_NAME === ""
    )
) {
    throw new ConfigInvalidException("Class name", "it can not be empty");
}
export const CLASS_NAME = _CLASS_NAME.split(';') as string[];

for (let i = 0; i < CLASS_NAME.length; i++) {
    CLASS_NAME[i] = CLASS_NAME[i].trim();
}

// study time
if (
    typeof _STUDY_TIME_MIN !== "string" ||
    !(/^\d+$/.test(_STUDY_TIME_MIN))
) {
    throw new ConfigInvalidException("study time", "must be only digits");
}
if (MODE === RunMode.auto && Number(_STUDY_TIME_MIN) <= 0) {
    throw new ConfigInvalidException(
        "study time",
        "When the running mode is set to \"auto\", study time must be greater than 0"
    );
}
export const STUDY_TIME_MS = Number(_STUDY_TIME_MIN) * 60 * 1000;
