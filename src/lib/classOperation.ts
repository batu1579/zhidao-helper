import { Record } from "./logger";
import { LONG_WAIT_MS } from "../global";
import { ValueException } from "./exception";
import { simulatedClick } from "./simulateOperation";

export function enterClass(className_: string): string | undefined {
    sleep(LONG_WAIT_MS * 5);

    let navBar = id("com.able.wisdomtree:id/bottom")
        .findOne()
        .find(
            className("RelativeLayout")
                .depth(6)
                .clickable(true)
        );

    if (!navBar[1].checked()) {
        navBar[1].click();
    }

    sleep(LONG_WAIT_MS * 3);

    let classList = id("com.able.wisdomtree:id/rv_login_view")
        .findOne()
        .children()
        .slice(0, -2);

    for (let i = 0; i < classList.length; i++) {
        const element = classList[i];

        let classNameWidget = element.findOne(textContains(className_));

        if (classNameWidget !== null) {
            element.child(0)?.click();

            sleep(LONG_WAIT_MS);
            if (textContains("查看平时分").exists()) {

                textContains("查看平时分").findOne().click();
                back();
            }

            return classNameWidget.text();
        }
    }

    return undefined;
}

export function autoWatchCourse(courseName: string, studyTime: number): void {
    // 进入课程
    let realClassName = enterClass(courseName);

    if (realClassName === undefined) {
        Record.warn(`not found class name contains "${courseName}"`);
        return;
    }

    sleep(LONG_WAIT_MS * 3);

    // 开始学习
    Record.info(`start studying "${realClassName}" course`);
    startStudyByTime(studyTime);

    // 退出课程
    back();
    text("确定").findOne().click();
    Record.info(`stop studying ${realClassName} course`);
}

/**
 * @description: 学习任意课程
 * @param {number} studyTime 要学习的毫秒数
 */
export function startStudyByTime(studyTime: number): void {
    // 点击继续学习
    id("com.able.wisdomtree:id/continue_study_btn")
        .findOne()
        .click();

    // 全屏显示
    id("com.able.wisdomtree:id/ijk_layout_controller_cover_screen_btn")
        .findOne()
        .click();

    // 调整速度
    sleep(LONG_WAIT_MS);
    changeSpeed("1.5x");

    // 取消全屏
    back();

    let startTime = Date.now();
    let endTime = startTime + studyTime;

    while (Date.now() < endTime) {
        answerQuestion();
    }
    Record.debug("end course loop");

    // 完成结束时可能出现的题目
    answerQuestion()
    Record.log(`study time: ${(Date.now() - startTime) / 1000 / 60} min`);
}

export function answerQuestion(): void {
    if (textContains("弹题").findOnce() !== null) {
        Record.debug("发现题目");
        sleep(LONG_WAIT_MS * 3);
        __answerQuestion();
    }
}

const QuestionOptions = ["单选题", "多选题", "判断题"] as const;

type QuestionType = typeof QuestionOptions[number]

function __answerQuestion(): void {
    let questionType = filter((i) => {
        return QuestionOptions.indexOf(i.text() as QuestionType) !== -1;
    }).findOne().text() as QuestionType;

    Record.debug(`题目类型： ${questionType}`);

    switch (questionType) {
        case "判断题":
        case "单选题":
            answerSingleChoiceQuestion();
            break;

        case "多选题":
        // TODO(batu1579): 补充对于多选题的支持

        default:
            throw new ValueException(`Question type "${questionType}" not supported`);
    }

    // 退出答题
    sleep(LONG_WAIT_MS);
    text("关闭").findOne().click();
}

function answerSingleChoiceQuestion(): void {
    let choiceList = className("android.widget.ListView")
        .findOne()
        .children();

    // 尝试选答案
    simulatedClick(choiceList[0]);

    // 获取正确答案
    let correctAnswer = /正确答案[:：]\s?(.*)$/.exec(
        textContains("正确答案")
            .findOne()
            .text()
    )![1];

    Record.debug(`选择正确答案： ${correctAnswer}`);
    sleep(random(LONG_WAIT_MS, LONG_WAIT_MS * 2));

    // 选择正确答案
    simulatedClick(choiceList[correctAnswer.charCodeAt(0) - 65]);
}

const SPEEDS = ["1.0x", "1.25x", "1.5x"] as const;

/**
 * @description: 切换课程播放速度。
 * @param {typeof} targetSpeed 需要切换到的速度，可选的值为：
 * 
 * - 1.0x
 * - 1.25x
 * - 1.5x
 * 
 * @return {boolean} 是否切换成功。
 */
export function changeSpeed(targetSpeed: typeof SPEEDS[number]): boolean {
    let speedButton: UiObject | null;

    do {
        speedButton = id("com.able.wisdomtree:id/ijk_layout_controller_cover_rate_btn").findOnce();

        if (speedButton === null) {
            return false;
        }

        if (speedButton.text() === targetSpeed) {
            Record.log(`change speed to ${targetSpeed}`);
            return true;
        }

        speedButton.click();

    } while (true);
}
