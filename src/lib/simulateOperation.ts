import { LONG_WAIT_MS } from "../global";
import { Record } from "./logger";

export function simulatedFindOnceAndClick(selector: UiSelector): boolean {
    const widget = selector.findOnce();

    if (!widget) {
        return false;
    }

    return simulatedClick(widget);
}

export function simulatedUntilFindAndClick(selector: UiSelector): boolean {
    const widget = selector.findOne();
    return simulatedClick(widget);
}

export function simulatedClick(widget: UiObject): boolean {
    let widgetBounds = widget.bounds();

    let offsetX = widgetBounds.width() / 4;
    let offsetY = widgetBounds.height() / 4;

    let x = Math.round(widgetBounds.centerX() + random(-offsetX, offsetX));
    let y = Math.round(widgetBounds.centerY() + random(-offsetY, offsetY));

    Record.debug(`simulated click screen: [${x}, ${y}]`)

    sleep(random(0, LONG_WAIT_MS))

    return click(x, y);
}