#!/usr/bin/env node

import * as commander from 'commander';
import {createProject, createModule} from './command';
import {getPackageVersion} from './utility';

commander
    .command('create <projectName>')
    .description('create new project')
    .action(function(projectName, options) {
        console.log('Project name: ',projectName, commander.module);        
        createProject(projectName, commander.module);
    });

commander
    .version(getPackageVersion())
    .option("-m, --module [moduleName]", "create a new module", generateModule);

commander.parse(process.argv);

function generateModule(moduleName :string) {
    if(commander.rawArgs && commander.rawArgs.indexOf("create") > -1){
        return moduleName;
    }
    console.log("Create Module :", moduleName);
    createModule(moduleName);
}
