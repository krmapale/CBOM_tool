#! /usr/bin/env node
'use strict'

import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';



let pqcbomVersion = '0.0.1';


yargs(hideBin(argv))
    .env('PQCBOM')
    .scriptName('pqcbom')
    .options({
        input: {
            alias: 'i',
            description: 'Input directory path',
            requiresArg: true
        },
        output: {
            alias: 'u',
            description: 'Output file name',
            requiresArg: true
        },
        git: {
            alias: 'git',
            description: 'Git repo',
            requiresArg: true
        },
        docker: {
            alias: 'docker',
            description: 'Docker container',
            requiresArg: true
        }
    })
    .help()
    .alias('help', 'h')
    .version('version', 'Show version number', pqcbomVersion)
    .alias('v', 'version')
    .argv;

/**
const argvSpliced = argv.slice(2);
const argvSplicedLength = argvSpliced.length;

// Check for any arguments.
if(argvSplicedLength > 0){
    const optionIndex = 0;
    const pathIndex = 1; 
        // If a single argument is given and matches option for help or version, print values.
        if(argvSplicedLength == 1){
            if(argvSpliced[optionIndex] == '-h' || argvSpliced[optionIndex] == '--help'){
                printManualPage();
            }
            if(argvSpliced[optionIndex] == '-v' || argvSpliced[optionIndex] == '--v'){
                console.log(pqcbomVersion);
            }
        }
        // If two arguments were given, check for correct options, followed by a valid directory path.
        if(argvSplicedLength == 2){
            if(argvSpliced == '--git'){
                //TODO
            }
            if(argvSpliced == '--docker'){
                //TODO
            }
            if(argvSpliced == '-i' || argvSpliced == '--i'){
                //if(argv.length == 4)
            }
        }
        else{
            console.log("Not a valid argument. Use argument --h to see argument options.")
        }
}
// If no arguments were given, scan current directory.
else {
    console.log("Scanning path: " + process.cwd());
    scanDirectory(process.cwd());
    createBomFile();
}

// Go through given arguments and save them to logCmdCall array. 
argvSpliced.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    });
 */

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
 * Print manual from README.md, starting after ```text up to ```. 
 */
function printManualPage(){
    const readmeFile = "README.md";
    fs.readFile(path.join(process.cwd(), readmeFile), 'utf-8', (err, data) => {
        if (err) throw err;
        let splitData = data.substring(data.indexOf('```text')+1, data.lastIndexOf('```'));
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