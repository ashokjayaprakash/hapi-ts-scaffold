import * as winston from "winston";
import {config} from "../../config";

class Logger {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public debug(format: string, ...params: string[]) {
        winston.log.apply(this, ["debug", this.name + " - " + format].concat(params));
    }

    public info(format: string, ...params: string[]) {
        winston.log.apply(this, ["info", this.name + " - " + format].concat(params));
    }

    public warn(format: string, ...params: string[]) {
        winston.log.apply(this, ["warn", this.name + " - " + format].concat(params));
    }

    public error(format: string, ...params: string[]) {
        winston.log.apply(this, ["error", this.name + " - " + format].concat(params));
    }
}

export default function() {
    return new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                name: "app-log",
                filename: `${config.APP_CONFIG.LOG_PATH}/${config.APP_CONFIG.LOG_FILE_NAME}.log`,
                level: config.APP_CONFIG.LOG_LEVEL
            })
        ]
    });
}
