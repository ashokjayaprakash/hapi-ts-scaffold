import * as path from 'path';

export const APP_CONSTANT = {
    CONTROLLER: "Controller",
    MODEL: "Model",
    ROUTE: "Route"
};

export const FILE_EXT = {
    TS: ".ts",
    TMPL: ".tmpl"
}

export const API_TYPE: any = {
    POST: "create",
    GET: "get",
    PUT: "update",
    DELETE: "delete"
};

export const PROJECT_DIR: any = {
    PATH: path.resolve(__dirname, '..', '..', 'template'),        
    APP: "app",
    MODULE: "module",
    HELPER: "helper",
    TEST: "test",    
}

export const TEMPLATE_DIR: any = {
    PATH: path.resolve(__dirname, '..'),    
    NAME: "template",
    ROOT: "root",
    APP: "app",
    HELPER: "helpers",
    MODULE: "module"    
};