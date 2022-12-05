import { LONG_WAIT_MS, SHORT_WAIT_MS, SWIPE_DIRECTION, UNLOCK_PWD } from "../global";

type Direction = "toTop" | "toBottom" | "toLeft" | "toRight";

const POINTS: { [prop: string]: [number, number] } = {
    left: [device.width / 5, device.height / 2],
    right: [(device.width / 5) * 4, device.height / 2],
    bottom: [device.width / 2, (device.height / 5) * 4],
    top: [device.width / 2, device.height / 5],
}

export function unlock() {
    device.wakeUpIfNeeded();
    sleep(LONG_WAIT_MS * 5);

    switch (SWIPE_DIRECTION as Direction) {
        case "toRight":
            gesture(SHORT_WAIT_MS, POINTS.left, POINTS.right);
            break;
        case "toLeft":
            gesture(SHORT_WAIT_MS, POINTS.right, POINTS.left);
            break;
        case "toBottom":
            gesture(SHORT_WAIT_MS, POINTS.top, POINTS.bottom);
            break;
        case "toTop":
            gesture(SHORT_WAIT_MS, POINTS.bottom, POINTS.top);
            break;
    }

    sleep(LONG_WAIT_MS * 3);

    if (UNLOCK_PWD !== undefined || UNLOCK_PWD !== "") {
        for (let num of UNLOCK_PWD as string) {
            click(num);
        }
    }
}
