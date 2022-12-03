/*
 * @Author: BATU1579
 * @CreateDate: 2022-05-24 16:58:03
 * @LastEditor: BATU1579
 * @LastTime: 2022-11-20 20:07:04
 * @FilePath: \\src\\index.ts
 * @Description: 脚本入口
 */
import {
    MODE,
    RunMode,
    CLASS_NAME,
    STUDY_TIME_MS,
    LISTENER_INTERVAL,
} from "./global";

import { init } from "./lib/init";
import { Record } from "./lib/logger";
import { unlock } from "./lib/unlock";
import { PermissionException } from "./lib/exception";

import {
    autoWatchCourse
} from "./lib/classOperation";

init();

Record.info("Start running script");

Record.log(`running in ${MODE} mode`);

if (MODE === RunMode.auto) {
    // auto mode
    unlock();
    Record.log("unlock device");

    let brightness = device.getBrightness();
    let musicVolume = device.getMusicVolume();
    changeSettings();
    device.keepScreenDim();

    launchApplication();
    Record.log("app launched");

    for (let i = 0; i < CLASS_NAME.length; i++) {
        const ELEMENT = CLASS_NAME[i];
        autoWatchCourse(ELEMENT, STUDY_TIME_MS);
    }

    device.setBrightness(brightness);
    Record.log(`set brightness to ${brightness}`);
    device.setMusicVolume(musicVolume);
    Record.log(`set music volume to ${musicVolume}`);
    device.cancelKeepingAwake();

    Record.info("The scheduled task has been completed");
} else if (MODE === RunMode.manual) {
    // manual mode
}

threads.shutDownAll();
exit();

function changeSettings() {
    try {
        device.setMusicVolume(0);
        Record.log("set music volume to 0");

        device.setBrightnessMode(0);
        device.setBrightness(0);
        Record.log("set brightness to 0");
    } catch (error) {
        throw new PermissionException(
            "Script have no permission to modify system Settings"
        );
    }
}

function launchApplication() {
    let xiaomiLaunchDialogWatcher = setInterval(() => {
        if (text("启动应用").exists()) {
            text("允许").findOne().click();
        }
    }, LISTENER_INTERVAL);

    launchApp("知到");

    id("com.able.wisdomtree:id/bottom").waitFor();
    clearInterval(xiaomiLaunchDialogWatcher);
}
