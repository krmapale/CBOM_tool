#! /usr/bin/env node
'use strict';


import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { NodeCrypto, WebCryptoAPI } from './cryptoLibraries.js';


let pqcbomVersion = '0.0.1';
var componentObjects = new Array();

// node memo: new URL();


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




//TODO: do testing
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

    // testing---------------------------------
    const obj = {
        name: 'component'
    }
    const tmparray = [obj,obj,obj];
    // testing-----------------------------

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

        // scanDirectory should return an array that contains javascript objects (components)
        components: new Array(scanDirectory(dirPath))
    }

    
    fs.writeFile(filename, JSON.stringify(bomObj, false, 2), (err) => {
        if (err) throw err;
        console.log("");
        console.log("file " + filename + " created!");
        console.log("");
    });

    fs.readFile(filename, 'utf-8' ,(err, data) => {
        if (err) throw err;
        console.log('fs.readfile data: ' + data);
      }); 
    
}




/**
 * Recursively scans given directory.
 * @param {Begins dir scanning from this path} directoryPath 
 * @returns an array of component objects
 */
function scanDirectory(directoryPath) {

    try{
        const files = fs.readdirSync(directoryPath);

        files.forEach(file => {

            const filePath = path.join(directoryPath, file);

            const isDir = fs.statSync(filePath).isDirectory();

            if (isDir) {
                console.log('---Is directory. Keep scanning: ' + filePath);
                scanDirectory(filePath); // Recursively scan subdirectory

            } else {
                console.log('---Not a directory: ' + filePath); // Log file path
                const fileExtension = path.extname(filePath);

                // If file extension is supported..
                if(checkFileExtension(fileExtension)){
                    console.log('Supported file type: ' + fileExtension);
                    let components = getComponents(filePath, fileExtension);
                    //console.log('Retrevied components: ' + JSON.stringify(components) + ' from ' + filePath);

                    if(components != null || components != undefined){
                        components.forEach(component => {
                            console.log('silmukan sisällä');
                            componentObjects.push(component); 
                            //console.log('comparray: ' + JSON.stringify(componentObjects));
                        });
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error scanning directory:', error);
    }

    //console.log('comparray last: ' + JSON.stringify(componentObjects, null, 2));
    return componentObjects;
}


/**
 * Searches for cryptographic components within a given file. First checks if file extension type is supported. 
 * @param {Path to file} filePath 
 * @param {Files extension} fileExtension 
 * @returns an array of cryptographic components
 */
function getComponents(filePath, fileExtension){
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const nodeCryptoObj = new NodeCrypto(); // create a NodeCrypto object that is used to retreive regexpes
    let libFound = false;
    let components = new Array(); // add found components to this array

    if(fileExtension == '.js' | fileExtension == '.ts'){

        // NodeCrypto.importRegexp has an array of regexpes that match importing from Node crypto library
        nodeCryptoObj.importRegexp.forEach((regexpItem) => {

            // Checks if any matches on Node crypto library are found.
            if(fileContent.match(regexpItem) != null){
                const tmpArray = fileContent.match(regexpItem);
                tmpArray.forEach(element => {
                    console.log('Found import: ' + element);
                });
                libFound = true;
            }
        }); 
        
        // if matches node crypto require statement
        if(fileContent.match(nodeCryptoObj.requireRegexp)){
            const tmpArray1 = fileContent.match(nodeCryptoObj.requireRegexp);
            console.log('Found require(\'node\'): ' + tmpArray1[0]);
            libFound = true;
        }

        // Note. This might cause issues if this part doesn't progress in order (top to bottom). Might need to add while-loop etc.
        // If node library is found, search for cryptographic components (TODO: later might need to add so that searches even without found crypto library?)
        if(libFound){
            console.log('Node Crypto library found!');
            //components.push(addComponent(filePath, 'algorithm')); // Temporary solution.
            nodeCryptoObj.algorithm.forEach(element => {
                const tmpRegexp = new RegExp(`(((crypto|diffieHellman|ecdh)\\.)|\\s*)\\b${element}\\('(\\w+)(-(\\w*))*'`, 'g');
                //if(fileContent.match(tmpRegexp))
            });
        }
    }
    if(fileExtension == '.py'){
        
    }
    if(fileExtension == '.cs'){
        
    }
    if(fileExtension == '.java'){
        
    }

    return components;
}


/**
 * Checks if file extension is of supported type.
 * @param {Path to file} filePath 
 * @returns True if file extension is supported, false if not.
 */
function checkFileExtension(fileExtension){
    let tmpBool = false;
    const fileExtensions = ['.js', '.py', '.cs', '.java'] //TODO: add a lot more extensions and think of a better way to store these values?
    for (const element of fileExtensions){
        if (element == fileExtension){
            tmpBool = true;
        }
    }
    return tmpBool;
}





/**
 * Creates and returns a cycloneDX cryptographic component.
 * @param {Path to file} filePath 
 * @param {Specifies the type of cryptographic asset} cryptoAssetType 
 * @returns a cycloneDX cryptographic component
 */
function addComponent(filePath, cryptoAssetType){
    const component = {
        name: undefined,
        type: 'cryptographic-asset',
        bomref: undefined,
        properties: {
            name: 'SrcFile',
            value: filePath
        },
        cryptoProperties: {
            assetType: cryptoAssetType, //TODO: luo aliohjelma joka tarkistaa onko kyse algoritmistä, avaimesta, certistä...
        }
    }

    // TODO: tee omat luokat näistä kaikista vaihtoehdoista?
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
            component.cryptoProperties.protocolProperties = { //TODO: for node, look up https://nodejs.org/api/crypto.html#crypto-constants
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


    //console.log('addComponent functions cryptographic component: ' + JSON.stringify(component));
    return component;
}


/**
 * Get timestamp for bom-file.
 * @returns current date and time
 */
function getTime(){
    return new Date();
}