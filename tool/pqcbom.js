#! /usr/bin/env node
'use strict';

import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';



let pqcbomVersion = '0.0.1';


const args = yargs(hideBin(argv))
    .env('PQCBOM')
    .option('i', {
        alias: 'input',
        description: 'Input directory path',
        requiresArg: true
    })
    .option('git', {
        description: 'Git repo',
        requiresArg: true
    })
    .option('docker', {
        description: 'Docker container',
        requiresArg: true
    })
    .option('o', {
        alias: 'output',
        description: 'Output file name',
        requiresArg: true
    })
    .scriptName('pqcbom')
    .help()
    .alias('help', 'h')
    .version('version', 'Show version number', pqcbomVersion)
    .alias('v', 'version')
    .argv;




//TODO: do testing and make this a loop!
if(args.i){
    createBomFile(args.o, args.i);
}
if(args.git){
    createBomFile(args.o, args.git);
}
if(args.docker){
    createBomFile(args.o, args.docker);
}




/**
 * Scans files from given directory.
 * @param {Directory that will be scanned} directoryPath 
 */
function scanDirectory(directoryPath, bomObj) {
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
                    bomObj = addComponent(filePath, bomObj);
                }
            });
        });
    });
}

function addComponent(filePath, bomObj){
    const component = {
        name: undefined,
        type: 'cryptographic-asset',
        bomref: undefined,
        cryptoProperties: {
            assetType: checkType(), //TODO: luo aliohjelma joka tarkistaa onko kyse algoritmistä, avaimesta, certistä...
        }
    }

    switch (component.cryptoProperties.assetType){
        case 'algorithm':
            component.cryptoProperties.algorithmProperties = {
                primitive: undefined, //TODO
                parameterSetIdentifier: undefined, //TODO
                mode: undefined,
                executionEnvironment: undefined, //TODO
                implemenetationPlatform: undefined, //TODO
                certificationLevel: undefined,
                cryptoFunctions: undefined, //TODO
                classicalSecurityLevel: undefined, //TODO
                nistQuantumSecurityLevel: undefined //TODO
            }
            break;
        case 'certificate':
            break;
        case 'related-crypto-material':
            break;
        case 'protocol':
            break;
    }

}

/**
 * Create bom.json file. 
 * TODO: TEST
 */
function createBomFile(filename, dirPath){

    //TODO: test if this works
    const fileNameExtension = '.json';
    if(filename == undefined){
        filename = "bom.json";
    }
    else {
        const filenameCleaned = filename.replace(/[/\\?%*:.|"<>]/g, '-');
        filename = filenameCleaned.concat(fileNameExtension);
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
                version: pqcbomVersion
            }
        },
        components: undefined
    }

    scanDirectory(dirPath, bomObj);
    
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