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
else{
    createBomFile(args.o, process.cwd());
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
        components: scanDirectory(dirPath)
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
 * Scans files recursively from given directory.
 * @param {Directory that will be scanned} directoryPath 
 */
function scanDirectory(directoryPath) {
    const componentArray = new Array();
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
                    // If file extension is supported..
                    if(checkFileExtension(filePath)){
                        // and supported cryptolibrary is found
                        if(checkForCryptoLibrary(filePath)){
                        // return an array of components from the source file and add them to componentArray
                        componentArray.push(getComponents(filePath));
                        }
                    }
                }
            });
        });
    });
}


function getComponents(filePath){

}

/**
 * Checks if file extension is of supported type.
 * @param {Path to file} filePath 
 * @returns True if file extension is supported, false if not.
 */
function checkFileExtension(filePath){
    let tmpBool = false;
    const fileExtensions = ['.js', '.py', '.cs', '.java'] //TODO: add a lot more extensions and think of a better way to store these values?
    const fileExtension = path.extname(filePath);
    for (const element of fileExtensions){
        if (element == fileExtension){
            tmpBool = true;
        }
    }
    return tmpBool;
}

function checkForCryptoLibrary(filePath){
    
}


/**
 * Check file type and scan if relevant. Return 
 * @param {Path to file} filePath 
 * @returns 
 */
function checkType(filePath){
    return 'algorithm';
}


function addComponent(filePath){
    const component = {
        name: undefined,
        type: 'cryptographic-asset',
        bomref: undefined,
        properties: {
            name: 'SrcFile',
            value: filePath
        },
        cryptoProperties: {
            assetType: checkType(filePath), //TODO: luo aliohjelma joka tarkistaa onko kyse algoritmistä, avaimesta, certistä...
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
            component.cryptoProperties.certificateProperties = {
                subjectName:  undefined, //"CN = www.google.com",
                issuerName: undefined, //"C = US, O = Google Trust Services LLC, CN = GTS CA 1C3",
                notValidBefore: undefined, //"2016-11-21T08:00:00Z",
                notValidAfter: undefined, //"2017-11-22T07:59:59Z",
                signatureAlgorithmRef: undefined, //"crypto/algorithm/sha-512-rsa@1.2.840.113549.1.1.13",
                subjectPublicKeyRef: undefined, //"crypto/key/rsa-2048@1.2.840.113549.1.1.1",
                certificateFormat: undefined, //"X.509",
                certificateExtension: undefined, //"crt"
            }
            break;
        case 'related-crypto-material': 
            component.cryptoProperties.relatedCryptoMaterialProperties = {
                type: undefined, //"public-key",
                id: undefined, //"2e9ef09e-dfac-4526-96b4-d02f31af1b22",
                state: undefined, //"active",
                size: undefined, //2048,
                algorithmRef: undefined, //"crypto/algorithm/rsa-2048@1.2.840.113549.1.1.1",
                securedBy: {
                  mechanism: undefined, //"None"
                },
                creationDate: undefined, //"2016-11-21T08:00:00Z",
                activationDate: undefined, //"2016-11-21T08:20:00Z"
            }
            break;
        case 'protocol':
            component.cryptoProperties.protocolProperties = {
                type: undefined, //"tls",
                version: undefined, //"1.2",
                cipherSuites: [
                  {
                    name: undefined, //"TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                    algorithms: [
                        undefined, //"crypto/algorithm/ecdh-curve25519@1.3.132.1.12",
                        undefined, //"crypto/algorithm/rsa-2048@1.2.840.113549.1.1.1",
                        undefined, //"crypto/algorithm/aes-128-gcm@2.16.840.1.101.3.4.1.6",
                        undefined, //"crypto/algorithm/sha-384@2.16.840.1.101.3.4.2.9"
                    ],
                    identifiers: undefined, //[ "0xC0", "0x30" ]
                  }
                ],
                cryptoRefArray: [
                    undefined, //"crypto/certificate/google.com@sha256:1e15e0fbd3ce95bde5945633ae96add551341b11e5bae7bba12e98ad84a5beb4"
                ]
            }
            break;
    }



    return tempBomObj;
}


/**
 * Get timestamp for bom-file.
 * @returns current date and time
 */
function getTime(){
    return new Date();
}