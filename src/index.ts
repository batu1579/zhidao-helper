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
} from "./global";
import { init } from "./lib/init";

init();

Record.log(`running in ${MODE} mode`);

if (MODE === RunMode.auto) {
    // auto mode
} else if (MODE === RunMode.manual) {
    // manual mode
}

threads.shutDownAll();
exit();
