import * as path from 'path';
import * as fs from 'fs';

export function getPackageVersion() {
    let packageJSONPath = path.resolve(__dirname, '../', "package.json");
    let packageJSON: any = fs.readFileSync(packageJSONPath);
    packageJSON = JSON.parse(packageJSON);
    return packageJSON.version;    
}