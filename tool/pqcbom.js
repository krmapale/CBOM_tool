#! /usr/bin/env node
'use strict';


import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { NodeCrypto, WebCryptoAPI } from './cryptoLibraries.js';
import { NistQuantumSecLevel } from './nistQuantumSecLevels.js';
import crypto from 'crypto';


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
                        if(componentObjects.length <= 0){
                            componentObjects = components;
                        } else {
                            componentObjects = componentObjects.concat(components);
                        }
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
            if(fileContent.match(regexpItem)){
                libFound = true;

                // Below only for testing
                const tmpArray = fileContent.match(regexpItem);
                tmpArray.forEach(element => {
                    console.log('Found import: ' + element);
                });

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

            let setOfAlgRegexpMatches = new Set();
            let setOfCryptMatRegexpMatches = new Set();
            let setOfCertRegexpMatches = new Set();
            
            setOfAlgRegexpMatches = findNodeCryptoComponents(nodeCryptoObj.algorithm, fileContent);
            setOfCryptMatRegexpMatches = findNodeCryptoComponents(nodeCryptoObj.relatedCryptoMaterial, fileContent);
            setOfCertRegexpMatches = findNodeCryptoComponents(nodeCryptoObj.certificate, fileContent); 

            if(setOfAlgRegexpMatches.size > 0){
                setOfAlgRegexpMatches.forEach(regexpMatch => {
                    components.push(addComponent(filePath, 'algorithm', regexpMatch));
                });

            }
            if(setOfCryptMatRegexpMatches.size > 0){
                setOfCryptMatRegexpMatches.forEach(regexpMatch => {
                    components.push(addComponent(filePath, 'related-crypto-material', regexpMatch));
                });

            }
            if(setOfCertRegexpMatches.size > 0){
                setOfCertRegexpMatches.forEach(regexpMatch => {
                    components.push(addComponent(filePath, 'certification', regexpMatch));
                });

            }
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
 * Finds cryptographic components from a specific file. Search elements are given as a paramater 
 * and added to Node Crypto library specific regexp search. Search matches are added to an Array, converted to 
 * a Set object and returned. 
 * @param {Search elements that will be included in regexp search} searchElementsArray 
 * @param {Content of the file that is being scanned} fileContent 
 * @returns a set-object of regexp matches from the scanned file
 */
function findNodeCryptoComponents(searchElementsArray, fileContent){

    let tmpMatchArray = new Array();

    try {
        searchElementsArray.forEach(element => {
            const tmpRegexp = new RegExp(`((^(crypto|diffieHellman|ecdh)\\.)|\\s*)\\b${element}\\('(\\w+)(-(\\w*))*'`, 'g');
            if(fileContent.match(tmpRegexp)){
                tmpMatchArray = tmpMatchArray.concat(fileContent.match(tmpRegexp));
            }
        });
    } catch (error) {
        console.error('Error finding Node Crypto components:', error);
    }


    const tmpSet = new Set(tmpMatchArray);
    if(tmpSet.size > 0){
        console.log("findNodeCryptoComponents functions tmpSet: " , tmpSet);
    }


    return tmpSet;
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
 * Extract the first parameter from a method call. 
 * @param {A string that contains data about a crypto method call and it's first parameter} regexpMatchString 
 * @returns trimmed version of method calls first param
 */
function extractFirstParameter(regexpMatchString){

    let firstParam = regexpMatchString.slice(regexpMatchString.indexOf('\'')+1, regexpMatchString.lastIndexOf('\''));
    let firstParamTrim = firstParam.trim();

    if(firstParamTrim.match(/^(?!['"])\d+$/)){ //checks if parameter is digits only and not surrounded by quotes
        return firstParamTrim; 
    }
    if(firstParamTrim.match(/^\'(\w+)(-(\w*))*\'$/) | firstParamTrim.match(/^\"(\w+)(-(\w*))*\"$/)){
        firstParamTrim = firstParamTrim.replaceAll(/\'|\"/g , '');
    }
    else {
        return firstParamTrim;
    }    
}


/**
 * Creates and returns a cycloneDX cryptographic component.
 * @param {Path to file} filePath 
 * @param {Specifies the type of cryptographic asset} cryptoAssetType 
 * @returns a cycloneDX cryptographic component
 */
function addComponent(filePath, cryptoAssetType, regexpMatchString){


    let firstParam = extractFirstParameter(regexpMatchString); // retreives the parameter name from the method call (regexMatchString)
    let paramSetID = undefined;
    let classicalSecLvl = undefined;
    let nistQTsecLvl = undefined;
    let algorithmMode = undefined;
    const digitRegexp = new RegExp(/\d{3,}/, "g");
 

    let NistQTSecLevelClassInstance = new NistQuantumSecLevel();
    nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam); // NOTE: in instances like this: aes-256-cbc-hmac-sha256 just returns the quantum sec level of the first algorithm it finds.


    // This section handles going through all possible node crypto library's cipher arguments and extracts wanted information 
    // to the components attributes.
    let ciphers = crypto.getCiphers(); 
    for (let cipher of ciphers){
        if(firstParam.match(cipher)){                               //if a method calls first parameter matches a cipher string from crypto.getCiphers()
            let cipherString = cipher.replaceAll(/\'|\"/g , '');    // remove quotes
            if(cipherString.includes('-')){                         // if cipher name is divided by '-'
                const splitCipher = cipher.split('-');              // split into parts
                if(splitCipher[1].match(digitRegexp)){              // if the first part contains 3 or more digits
                    paramSetID = splitCipher[1].match(digitRegexp); // set the digits as value for paramSetID
                    classicalSecLvl = parseInt(paramSetID);         // use the same digits to give an integer value for classicalSecLvl
                }
                if(splitCipher.length > 2){                         // if the cipher string has atleast 3 parts
                    algorithmMode = splitCipher[2];                 // make an assumption that the third part defines the algorithm mode, -which it often does
                }
                // if the first split part mathces aes plus three or more digits and the second part matches "wrap"
                if(splitCipher[0].match(/aes\d{3,}/g) && splitCipher[1].match(/wrap/g)){
                    paramSetID = splitCipher[0].match(digitRegexp); // set digit value
                    classicalSecLvl = parseInt(paramSetID);         // set digit int value
                    algorithmMode = splitCipher[1];                 // set wrap as mode, even though might be incorrect?
                }
            }
            else{ // if the above conditions didn't match, check if the cipherString contains three or more digits and set those as values
                if(cipherString.match(digitRegexp)){
                    paramSetID = cipherString.match(digitRegexp);
                    classicalSecLvl = parseInt(paramSetID);
                }
            }
            break;
        }
    }

    crypto.getHashes().forEach(hash => {
        if(regexpMatchString.match(hash)){
            return hash.replaceAll(/\'|\"/g , '');
        }
    }); //TODO: continue on this

    


    //Make sure paramSetID is string, not an array object as it comes out from match-function
    if(paramSetID != undefined){
        paramSetID = paramSetID.toString();
    }


    const component = {
        name: firstParam,
        type: 'cryptographic-asset',
        bomref: undefined,
        properties: {
            name: 'SrcFile',
            value: filePath
        },
        cryptoProperties: {
            assetType: cryptoAssetType, 
        }
    }

    

    //TODO: Later fix this part to use a JSON file that contains information about the CycloneDX v1.6 cryptoProperties requirements and options. 
    switch (component.cryptoProperties.assetType){
        case 'algorithm':
            component.cryptoProperties.algorithmProperties = {
                primitive: undefined, //TODO
                parameterSetIdentifier: paramSetID, 
                mode: algorithmMode,
                executionEnvironment: undefined, 
                implemenetationPlatform: undefined, 
                certificationLevel: undefined,
                cryptoFunctions: undefined, 
                classicalSecurityLevel: classicalSecLvl, 
                nistQuantumSecurityLevel: nistQTsecLvl 
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