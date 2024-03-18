#! /usr/bin/env node

import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';

let logCmdCall = new Array();
console.log("");

argv.forEach((val, index) => {
    logCmdCall.push(val);
    console.log(`${index}: ${val}`);
  });

if(logCmdCall.length == 2){
    console.log("Scanning path: " + process.cwd());
    scanDirectory(process.cwd());
}
if(logCmdCall.length == 3){
    const argPathIndex = 2; 
    if(logCmdCall[argPathIndex].startsWith('--')){

        //TODO: remove "--" from scan path and think about the security aspects "/../etc"
        console.log("Scanning path: " + logCmdCall[argPathIndex]);
        //scanDirectory(logCmdCall[argPathIndex]);
    }
}

  // Create JS bom-object.
const bomObj = {
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    metadata: {
        timestamp: getTime(),
        component: {
            type: "application",
            name: "PQCBOM tool",
            version: "0.1"
        }
    }
}

// Function call
createBomFile(bomObj);


function scanDirectory(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error retrieving file stats:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    scanDirectory(filePath); // Recursively scan subdirectory
                } else {
                    console.log(filePath); // Log file path
                }
            });
        });
    });
}



/**
 * Create bom.json file.
 * @param {Javascript bom-object} bomObj 
 */
function createBomFile(bomObj){
    const filename = "bom.json";
    
    fs.writeFile(filename, JSON.stringify(bomObj, false, 2), (err) => {
        if (err) throw err;
        console.log("");
        console.log("file " + filename + " created!");
        console.log("");
    });

    fs.readFile(filename, 'utf-8' ,(err, data) => {
        if (err) throw err;
        console.log(data);
      }); 
    
}

/**
 * Get timestamp for bom-file.
 * @returns current date and time
 */
function getTime(){
    return new Date();
}