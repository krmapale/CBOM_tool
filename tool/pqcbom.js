#! /usr/bin/env node

import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';

let logCmdCall = new Array();
console.log("");
const pqcbomVersion = 0.1;

// Go through given arguments and save them to logCmdCall array. 
argv.forEach((val, index) => {
    logCmdCall.push(val);
    console.log(`${index}: ${val}`);
    // If no path is given, scan current dir
    if(argv.length == 2 && index == 1){
        console.log("Scanning path: " + process.cwd());
        scanDirectory(process.cwd());
        createBomFile();
    }
    // If a single argument is given, make sure that it is of correct format and then scan that directory.
    if(argv.length >= 3 && index == 2){ 
        if(val.startsWith('--') | val.startsWith('-')){
            if(val == '-h' || val == '--help'){
                printManualPage();
            }
        }
        if(val == '-v' || val == '--v'){
            console.log(pqcbomVersion);
        }
        if(val == '--git'){
            //TODO
        }
        if(val == '--docker'){
            //TODO
        }
        else{
            console.log("Not a valid argument. Use argument --h to see argument options.")
        }
    }
});


/**
 * Scans files from given directory.
 * @param {Directory that will be scanned} directoryPath 
 */
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
                    checkFileType(file, filePath);
                }
            });
        });
    });
}

/**
 * Check file type. Perform deeper scanning if type is supported.
 * @param {File name} file
 * @param {Path to located file} filePath 
 */
function checkFileType(file, filePath){
    
}

/**
 * Create bom.json file.
 */
function createBomFile(){

    const filename = "bom.json";
    // Create JS bom-object.
    const bomObj = {
        bomFormat: "CycloneDX",
        specVersion: "1.6",
        metadata: {
            timestamp: getTime(),
            component: {
                type: "application",
                name: "PQCBOM tool",
                version: pqcbomVersion
            }
        }
    }
    
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
 * Print manual from README.md
 */
function printManualPage(){
    const readmeFile = "README.md";
    fs.readFile(path.join(process.cwd(), readmeFile), 'utf-8', (err, data) => {
        if (err) throw err;
        let splitData = data.substring(data.indexOf('Options:')-1, data.lastIndexOf('```'));
        console.log(splitData);
    });
}

/**
 * Get timestamp for bom-file.
 * @returns current date and time
 */
function getTime(){
    return new Date();
}