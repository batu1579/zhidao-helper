/*
 * @Author: BATU1579
 * @CreateDate: 2022-02-04 16:09:50
 * @LastEditor: BATU1579
 * @LastTime: 2022-10-31 22:31:03
 * @FilePath: \\src\\lib\\exception.ts
 * @Description: 全局异常类
 */
import { EVENT } from "../global"
import {
    Record,
    getStackTrace,
    TraceCollectionType,
    TraceStackFrameType
} from "./logger";

EVENT.on("ERROR", (err: Exception) => {
    Record.error(err.toString());
})

export interface Exception {
    toString(): string;

    traceFormatter?: (line: number, callerName: string) => string;

    traceFilter?: (frame: TraceStackFrameType, index: number, array: TraceStackFrameType[]) => boolean;
}

export class BaseException implements Exception {

    protected exceptionType: string;
    protected message: string | undefined;
    protected traceBack: string;

    constructor(message?: string) {
        this.exceptionType = 'BaseException';
        this.message = message;

        let trace: TraceCollectionType = getStackTrace()
        if (this.traceFilter) {
            trace = trace.filter(this.traceFilter);
        }
        this.traceBack = trace.toString(this.traceFormatter);

        EVENT.emit("ERROR", this);
    }

    public traceFilter = undefined;

    public traceFormatter = undefined;

    public toString(): string {
        return (
            "Traceback (most recent call last):\n" +
            this.traceBack + "\n" +
            this.exceptionType + (this.message ? ": " + this.message : "") + "\n"
        )
    }
}

export class PermissionException extends BaseException {
    constructor(message: string) {
        super(message);
        this.exceptionType = "PermissionException";
    }
}

export class ValueException extends BaseException {
    constructor(message: string) {
        super(message);
        this.exceptionType = "ValueException";
    }
}

export class ConfigInvalidException extends ValueException {
    constructor(message: string) {
        super(message + ", please check it again !");
        this.exceptionType = "ConfigInvalidException";
    }
}
