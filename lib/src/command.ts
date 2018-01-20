import * as fs from 'fs-extra'; 
import * as path from 'path'; 
import * as _ from 'underscore';
import {camelize, classify, capitalize, decapitalize} from 'underscore.string';
import {APP_CONSTANT, PROJECT_DIR, TEMPLATE_DIR, FILE_EXT} from './config'; 

let ROOT_DIR = process.cwd();

function createProject(projectName :string, module? :string) {
    const name: string = projectName;
    const moduleName: string = module || projectName;
    console.log("PD :", path.join(ROOT_DIR, name));
    if(fs.existsSync(path.join(ROOT_DIR, name))) {
        throw(new Error("Project exists already."));
    }

    try {
        let dirPath = path.join(ROOT_DIR, name,  PROJECT_DIR.APP  , PROJECT_DIR.MODULE, PROJECT_DIR.HELPER);
        fs.ensureDirSync(dirPath);
        
        copyTemplate(name);
        modifyPackage(name);
        cloneFilesToModule(name, moduleName);
    } catch (e) {
        console.log("Create Project error :", e);
    }
}

function copyTemplate(name: string) {
    try {
        fs.copySync(path.join(TEMPLATE_DIR.PATH, TEMPLATE_DIR.NAME, TEMPLATE_DIR.ROOT), path.join(ROOT_DIR, name));
        fs.copySync(path.join(TEMPLATE_DIR.PATH, TEMPLATE_DIR.NAME, TEMPLATE_DIR.APP), path.join(ROOT_DIR, name, PROJECT_DIR.APP));
        fs.copySync(path.join(TEMPLATE_DIR.PATH, TEMPLATE_DIR.NAME, TEMPLATE_DIR.HELPER), path.join(ROOT_DIR, name, PROJECT_DIR.APP, PROJECT_DIR.MODULE, PROJECT_DIR.HELPER));        
    } catch (e) {
        console.log("Error while copy template :", e);
    }    
}

function cloneFilesToModule(projectName: string, moduleName: string) {
    try {
        console.log("App Path ",projectName, path.join(ROOT_DIR, projectName, PROJECT_DIR.APP, PROJECT_DIR.MODULE, moduleName));
        if(!fs.existsSync(path.join(ROOT_DIR, projectName, PROJECT_DIR.APP, PROJECT_DIR.MODULE, moduleName))) {
            fs.ensureDirSync(path.join(ROOT_DIR, projectName, PROJECT_DIR.APP, PROJECT_DIR.MODULE, moduleName));
            fs.copySync(path.join(TEMPLATE_DIR.PATH, TEMPLATE_DIR.NAME, TEMPLATE_DIR.MODULE), path.join(ROOT_DIR, projectName, PROJECT_DIR.APP, PROJECT_DIR.MODULE, moduleName));


            let controllerTemplate  = getTemplateDetails(APP_CONSTANT.CONTROLLER, moduleName);
            overwriteClonedFile(projectName, controllerTemplate, moduleName);
            
            let routeTemplate :any = getTemplateDetails(APP_CONSTANT.ROUTE, moduleName);
            routeTemplate.controller = controllerTemplate
            overwriteClonedFile(projectName, routeTemplate, moduleName);
    
            registerRoute(projectName, moduleName);

        } else {
            throw( new Error("Module already exists"));
        }
    } catch(e) {
        console.log("Create module exception :", e);
    }
}


function createModule(moduleName: string) {
    let packageJSONPath = path.join(ROOT_DIR, "package.json");
    if(!fs.existsSync(packageJSONPath)){
        throw( new Error("Navigate to project root folder and try creating new module"));
    }

    const projectName = ROOT_DIR.split(path.sep).pop();
    ROOT_DIR = path.resolve(ROOT_DIR, "../");
    
    cloneFilesToModule(projectName, moduleName);

}

function modifyPackage(name :string) {
    let packageJSONPath = path.join(ROOT_DIR, name, "package.json");
    let packageJSON: any = fs.readFileSync(packageJSONPath);
    packageJSON = JSON.parse(packageJSON);
    packageJSON.name = name;
    try {
        fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, '  '), "utf8");
    } catch(e) {
        console.log("Error in modifying package:", e);
    }    
}

function registerRoute(projectName: string, moduleName: string) {
    let filePath = path.join(ROOT_DIR, projectName, PROJECT_DIR.APP, "route.ts");
    try {
        
        let route: Buffer = fs.readFileSync(filePath);
        let routeData: string = route.toString();
        let extractedPlugin: string = routeData.substring(routeData.indexOf('['), routeData.lastIndexOf(']')+1);
        let compiledPlugin: string = buildRoutePlugin(moduleName, extractedPlugin);
        let compiledRoute = routeData.replace(extractedPlugin, compiledPlugin);
        fs.writeFileSync(filePath, compiledRoute, "utf8");
    } catch(e) {
        console.log("Error in modifying registerRoute:", e);
    }    
}

function buildRoutePlugin(name: string, data: string) {
    let parsedData: any = JSON.parse(data);
    let controllerInfo  = getTemplateDetails(APP_CONSTANT.CONTROLLER, name);
    let plugin: any = {
        plugin: {
            register: ""
        }
    }
    
    plugin.plugin.register = `./${PROJECT_DIR.MODULE}/${controllerInfo.name}/${controllerInfo.className}`
    parsedData.push(plugin);
    return JSON.stringify(parsedData, null, '  ');
}

function overwriteClonedFile(destDir: string, templateInfo: any, name: string) {
    let oldFileName = path.join(ROOT_DIR, destDir,  PROJECT_DIR.APP, PROJECT_DIR.MODULE, name, templateInfo.templateName);
    let newFileName = path.join(ROOT_DIR, destDir,  PROJECT_DIR.APP, PROJECT_DIR.MODULE, name, templateInfo.fileName);
    
    let fileData: any = fs.readFileSync(oldFileName, 'utf8');
    
    let complileTemplate: any= undefined;
    if(fileData){
        complileTemplate = _.template(fileData);
    }
    const compiledData = complileTemplate(templateInfo)

    try {
        fs.writeFileSync(oldFileName, compiledData, "utf8");
        fs.renameSync(oldFileName, newFileName);
    } catch(e) {
        console.log("Error in modifying package:", e);
    }    
}

function getTemplateDetails(type: string, name: string) {
    let templateInfo = {
        name: "",
        fileName: "",
        className: "",
        moduleName: "",
        functionName: "",
        templateName: ""
    };
    
    switch(type) {
        case APP_CONSTANT.CONTROLLER:
            templateInfo.className = classify(name.concat(APP_CONSTANT.CONTROLLER));            
            templateInfo.templateName = APP_CONSTANT.CONTROLLER.concat(FILE_EXT.TMPL);            
            break;
        case APP_CONSTANT.ROUTE:
            templateInfo.className = classify(name.concat(APP_CONSTANT.ROUTE));            
            templateInfo.templateName = APP_CONSTANT.ROUTE.concat(FILE_EXT.TMPL);
            break;
        default:
            break;
    }

    templateInfo.name = decapitalize(name);
    templateInfo.moduleName = camelize(templateInfo.className);
    templateInfo.fileName = templateInfo.moduleName.concat(FILE_EXT.TS);
    templateInfo.functionName = capitalize(name);
    return templateInfo;
}

export {
    createProject,
    createModule
}; 