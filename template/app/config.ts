"use strict";

const DEPLOY_MODE: string = process.env.DEPLOY_MODE;
const PORT: number = Number(process.env.PORT);
const APP_LOG_PATH: string = process.env.APP_LOG_PATH || "";

const LOAD_CONFIG: Object = {
    "maxHeapUsedBytes": 1073741824,
    "maxRssBytes": 1610612736,
    "maxEventLoopDelay": 5000
};

const APP_CONFIG = {
    "LOG_PATH" : APP_LOG_PATH,
    "LOG_FILE_NAME" : "application",
    "LOG_LEVEL" : "debug",
};

export const config = {
    DEPLOY_MODE: DEPLOY_MODE,
    PORT: PORT,
    LOAD_CONFIG: LOAD_CONFIG,
    APP_CONFIG: APP_CONFIG,
    APP_LOG_PATH: APP_LOG_PATH
};

export default config;
