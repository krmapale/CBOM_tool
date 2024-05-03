#! /usr/bin/env node
'use strict';


import fs from 'node:fs';
import path, { parse } from 'node:path'; 
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



if(Object.keys(args).length === 2){ //if no args are given
    createBomFile(args.o, process.cwd());
}
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
 * Create bom.json file. 
 * TODO: TEST
 */
function createBomFile(filename, dirPath){

    //TODO: test if this works
    const fileNameExtension = '.json';
    if(filename == undefined){
        filename = "bom.json";

        // This part is for making sure that no files are overwriten (or no permission problems arise)
        const filesInWorkDir = fs.readdirSync(process.cwd());
        if(filesInWorkDir.includes(filename)){
            console.log(filename + " already exists!");
            const fname = filename.slice(0, filename.lastIndexOf("."));
            const fextension = path.extname(filename);
            const time = getTime();
            filename = fname + time.getMilliseconds() + fextension;
            console.log("Changing name to: " + filename);
        }
    }
    else {
        // TODO: this still needs more work. Just a quick solution, not tested enough.
        const filenameCleaned = filename.replace(/[/\\?%*:.|"<>\/]/g, '-');
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
        directoryPath = path.normalize(directoryPath);
        const fileStats = fs.lstatSync(directoryPath);

        if(fileStats.isFile() && !directoryPath.includes('/') && !directoryPath.includes('\\') && !path.isAbsolute(directoryPath)){ 
            //directoryPath = path.join(process.cwd(), path.basename(directoryPath));
            directoryPath = fs.realpathSync(directoryPath);

        }
        if(fileStats.isFile() && path.isAbsolute(directoryPath)){
            const fileExtName =  path.extname(directoryPath);
            console.log(directoryPath);
            if(checkFileExtension(fileExtName)){
                console.log('Supported file type: ' + fileExtName);
                let foundComponents = getComponents(directoryPath, fileExtName);
                //console.log('Retrevied components: ' + JSON.stringify(components) + ' from ' + filePath);

                if(foundComponents != null || foundComponents != undefined){
                    if(componentObjects.length <= 0){
                        componentObjects = foundComponents;
                    } else {
                        componentObjects = componentObjects.concat(foundComponents);
                    }
                }
            }
        }
        if (fileStats.isDirectory()) { 
            
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
        }
    } catch (error) {
        console.error('Error scanning directory:', error);
    }

    //console.log('comparray last: ' + JSON.stringify(componentObjects, null, 2));
    return componentObjects;
}


/**
 * Searches for cryptographic components within a given file. First checks if file extension type is supported. 
 * Initially works on Javascript and TypeScript files only, but will be expanded to other filetypes later on. 
 * @param {Path to file} filePath 
 * @param {Files extension} fileExtension 
 * @returns an array of cryptographic components
 */
function getComponents(filePath, fileExtension){
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let libFound = false;
    let components = new Array(); // add found components to this array


    // Currently crypto components can only be gotten from these filetypes. 
    if(fileExtension == '.js' || fileExtension == '.ts'){

        const nodeCryptoObj = new NodeCrypto(); // create a NodeCrypto object that is used to retreive regexpes

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

            // get all the node crypto library's method calls that are relevant for creating cryptographic components. 
            // currently no duplicates are added. TODO: think if duplicates should be ok?
            setOfAlgRegexpMatches = findNodeCryptoComponents(nodeCryptoObj.algorithm, fileContent, 'algorithm');
            setOfCryptMatRegexpMatches = findNodeCryptoComponents(nodeCryptoObj.relatedCryptoMaterial, fileContent, 'relatedCryptoMaterial');
            setOfCertRegexpMatches = findNodeCryptoComponents(nodeCryptoObj.certificate, fileContent, 'certificate'); 

            // go through all found method calls, create a crypto component from the method calls first parameter values and 
            // add component to components-list. 
            if(setOfAlgRegexpMatches.size > 0){
                setOfAlgRegexpMatches.forEach(regexpMatch => {
                    components.push(addComponent(filePath, fileExtension, 'algorithm', regexpMatch));
                });

            }
            if(setOfCryptMatRegexpMatches.size > 0){
                setOfCryptMatRegexpMatches.forEach(regexpMatch => {
                    components.push(addComponent(filePath, fileExtension, 'related-crypto-material', regexpMatch));
                });

            }
            if(setOfCertRegexpMatches.size > 0){
                setOfCertRegexpMatches.forEach(regexpMatch => {
                    components.push(addComponent(filePath, fileExtension, 'certification', regexpMatch));
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
function findNodeCryptoComponents(searchElementsArray, fileContent, propertyName){

    let tmpMatchArray = new Array();

    try {
        switch(propertyName){
            case 'algorithm':
                searchElementsArray.forEach(element => {
                    const algorithmRegexp = new RegExp(`(^(crypto|diffieHellman|ecdh)\\.)|\\b${element}\\(['"](\\w+)(-(\\w*))*['"](,|\\))`, 'g');
                    if(fileContent.match(algorithmRegexp)){
                        const algMatchArray = fileContent.match(algorithmRegexp);
                        if(tmpMatchArray.length <= 0){
                            algMatchArray.forEach(match => {
                                tmpMatchArray.push(match);
                            });
                        }
                        else{
                            tmpMatchArray = tmpMatchArray.concat(algMatchArray);
                        }
                    }
                });
                break;
            case 'relatedCryptoMaterial':
                searchElementsArray.forEach(element => {
                    const relCryptMatRegexp = new RegExp(`(^(crypto|diffieHellman|ecdh)\\.)|\\b${element}\\((\\{|(['"](\\w+)(-(\\w*))*["']))\\s*[^;]*\\s*((\\}\\))|(\\);))`, 'g');
                    if(fileContent.match(relCryptMatRegexp)){
                        const relCryptMatMatchArray = fileContent.match(relCryptMatRegexp);
                        relCryptMatMatchArray.forEach(matchElement => {
                            if(matchElement.match(/\bhash\s*:\s*'[\w\d-]*',/g)){
                                const hashMatches = matchElement.match(/\bhash\s*:\s*'[\w\d-]*',/g);
                                hashMatches.forEach(hashMatch => {
                                    tmpMatchArray.push(hashMatch);
                                });
                            }
                            if(matchElement.match(/\bcipher\s*:\s*'[\w\d-]*'/g)){
                                const cipherMatches = matchElement.match(/\bcipher\s*:\s*'[\w\d-]*',/g);
                                cipherMatches.forEach(cipherMatch => {
                                    tmpMatchArray.push(cipherMatch);
                                });
                            }
                            tmpMatchArray.push(matchElement);
                        });

                    }
                });
                break;
            case 'certificate':
                break;         
        }
    } catch (error) {
        console.error('Error finding Node Crypto components:', error);
    }


    const returnSet = new Set(tmpMatchArray);
    if(returnSet.size > 0){
        console.log("findNodeCryptoComponents functions tmpSet: " , returnSet);
    }


    return returnSet;
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
 * Extract the first parameter from a method call. Works on javascript/typescript(?)
 * @param {A string that contains data about a crypto method call and it's first parameter} regexpMatchString 
 * @returns trimmed version of method calls first param
 */
function extractFirstParameter(regexpMatchString){

    //let firstParam = regexpMatchString.slice(regexpMatchString.indexOf('\'')+1, regexpMatchString.lastIndexOf('\''));
    let firstParam = regexpMatchString.match(/\((\'|\"{0,1})[\w\d-]*(\'|\"){0,1}(,|\))/g);
    let firstParamTrim;

    if(firstParam == null){  
        if(regexpMatchString.match(/\bname\s*:\s*'[\w\d-]*'/g)){
            const nameParam = regexpMatchString.match(/\bname\s*:\s*'[\w]*'/g)
            firstParam = nameParam[0].match(/['"]{1}[\w]*['"]{1}/g);
            firstParamTrim = firstParam[0].replace(/\'|\"/g , '');
            return firstParamTrim;
        }
        if(regexpMatchString.match(/\bhash\s*:\s*'[\w\d-]*'/g)){
            const hashParam = regexpMatchString.match(/\bhash\s*:\s*'[\w\d-]*'/g)
            firstParam = hashParam[0].match(/['"]{1}[\w\d-]*['"]{1}/g);
            firstParamTrim = firstParam[0].replace(/'|"/g , '');
            return firstParamTrim;
        }
        if(regexpMatchString.match(/\bcipher\s*:\s*'[\w\d-]*'/g)){
            const cipherParam = regexpMatchString.match(/\bcipher\s*:\s*'[\w\d-]*'/g)
            firstParam = cipherParam[0].match(/['"]{1}[\w\d-]*['"]{1}/g);
            firstParamTrim = firstParam[0].replace(/'|"/g , '');
            return firstParamTrim;
        }
    }

    if(firstParam == null){
        console.log("error extracting first parameter from: ", regexpMatchString);
    }
    else {
        firstParamTrim = firstParam[0].replace(/[\(\),]/g, "").trim();
    }


    //TODO: test this
    if(firstParamTrim.match(/^(?!['"])\d+$/)){ //checks if parameter is digits only and not surrounded by quotes
        return firstParamTrim; 
    }
    if(firstParamTrim.match(/^\'(\w+)(-(\w*))*\'$/) || firstParamTrim.match(/^\"(\w+)(-(\w*))*\"$/)){
        firstParamTrim = firstParamTrim.replace(/\'|\"/g , '');
        return firstParamTrim;
    }
    else {
        return firstParamTrim;
    }    
}

//TODO: TEST scenarios when only digits are given as param. Also go through bom.json and add NIST qt lvl for RSA-4096, also check des not showing nist qt lvl?


/**
 * Creates and returns a cycloneDX cryptographic component.
 * @param {Path to file} filePath 
 * @param {Specifies the type of cryptographic asset} cryptoAssetType 
 * @returns a cycloneDX cryptographic component
 */
function addComponent(filePath, fileExtension, cryptoAssetType, regexpMatchString){

    let nodeCryptoObject = new NodeCrypto();
    let NistQTSecLevelClassInstance = new NistQuantumSecLevel();
    const digitRegexp = new RegExp(/\d{3,}/, "g");

    let firstParam = extractFirstParameter(regexpMatchString); // retreives the parameter name from the method call (regexMatchString)
    let paramSetID = undefined;
    let classicalSecLvl = undefined;
    let nistQTsecLvl = undefined;
    let algorithmMode = undefined;
    let relatedCryptoMaterialSize = undefined;

    

    //TODO: TÄMÄ OSIO TÄYTYY MUOKATA MODULAARISEMMAKSI. Tarkistetaan tiedoston pääte, sekä cryptoAssetType ja poimitaan tiedot tilanteen vaatimalla tavalla. 
    if(fileExtension == '.js' || fileExtension == '.ts'){

        if(cryptoAssetType == 'algorithm'){
// This section handles going through all possible node crypto library's cipher arguments and extracts wanted information 
        // to the components attributes.
        let ciphers = crypto.getCiphers(); 
        for (let cipher of ciphers){
            if(cipher.match(firstParam)){                               //if a method calls first parameter matches a cipher string from crypto.getCiphers()
                if(cipher.includes('-')){                               // if cipher name is divided by '-'
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
                    if(cipher.match(digitRegexp)){
                        paramSetID = cipher.match(digitRegexp);
                        classicalSecLvl = parseInt(paramSetID);
                    }
                }

                // This part below is for cases like 'aes-256-cbc-hmac-sha256', where two three digit algorithms are found.
                // The NIST quantun security level algorithm would just find the quantum security level based on either 
                // algorithms that first match a specific defined string within the NistQuantumSecLevel-class. 
                // Therefore, we split the algorithm string so that we get the NIST qt sec level only from the first
                // three digit algorithm that was found within the string, as it is often the one that is more relevant. 
                const threeDigitsArray = firstParam.match(digitRegexp);
                if(threeDigitsArray != null && threeDigitsArray.length > 1){
                    const digits = firstParam.match(digitRegexp);
                    const firstParamUpToFirstThreeDigits = firstParam.slice(0, firstParam.indexOf(digits[0])+digits[0].length);
                    nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParamUpToFirstThreeDigits);
                }
                else{
                    nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam);
                }

                break;
            }
        }

        let hashes = crypto.getHashes();
        for(let hash of hashes){
            if(hash.match(firstParam)){
                const hashDigitsMatch = hash.match(digitRegexp);
                if(hashDigitsMatch != null){
                    paramSetID = hashDigitsMatch[0];
                    classicalSecLvl = parseInt(paramSetID);
                } 
                if(hash.includes("RSA") || hash.includes("rsassa")){
                    nistQTsecLvl = 0;
                }
                else { 
                    nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(hash);
                }
                break;
            }
        }
        }
        if(cryptoAssetType == 'related-crypto-material'){
            //NOTE: currently this extracts only algorithm data as it is most relevant to thesis.
            // This will need to be edited back to create related crypto material components. 
            cryptoAssetType = 'algorithm'; //Changing this to algorithm as a temporary fix. Modify later.

            // If getNistQuantumSecLevel returns a proper value, this means that all the extractable information
            // of the component can be found on the firstParam object.
            if(NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam) != undefined){
                nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam);
                paramSetID = firstParam.match(digitRegexp);
                classicalSecLvl = parseInt(paramSetID[0]);
            }
            if(Object.keys(nodeCryptoObject.diffieHellmanGroup.groups).includes(firstParam)){
                classicalSecLvl = nodeCryptoObject.diffieHellmanGroup.groups[firstParam];
                paramSetID = classicalSecLvl.toString();
                nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel('DH-' + paramSetID);
                //relatedCryptoMaterialSize = nodeCryptoObject.diffieHellmanGroup.groups[firstParam];
                //console.log(relatedCryptoMaterialSize);
            }
            if(regexpMatchString.match(/\bmodulusLength\s*:\s*\d+/g)){
                const modRegexp = regexpMatchString.match(/\bmodulusLength\s*:\s*\d+/g);
                const modLengthDigits = modRegexp[0].match(/\d+/g);
                try {
                    paramSetID = modLengthDigits[0];
                    classicalSecLvl = parseInt(modLengthDigits[0]);
                    nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam + "-" + paramSetID);
                    console.log(nistQTsecLvl);
                    //relatedCryptoMaterialSize = parseInt(modLengthDigits[0]);
                } catch (error){
                    console.error(error);
                }
            }
            if(regexpMatchString.match(/\blength\s*:\s*\d+/g)){
                const lengthRegexp = regexpMatchString.match(/\blength\s*:\s*\d+/g);
                const lengthDigits = lengthRegexp[0].match(/\d+/g);
                try {
                    paramSetID = lengthDigits[0];
                    classicalSecLvl = parseInt(lengthDigits[0]);
                    nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam + "-" + paramSetID);
                    //relatedCryptoMaterialSize = parseInt(lengthDigits[0]);
                } catch (error){
                    console.error(error);
                }
            }
            if(regexpMatchString.match(/\bnamedCurve\s*:\s*['"\w\d-]*\s*,/g)){
                const namedCurve = regexpMatchString.match(/\bnamedCurve\s*:\s*['"\w\d-]*\s*,/g);
                const curveDigits = namedCurve[0].match(/\d{3}/g);
                try {
                    paramSetID = curveDigits[0];
                    classicalSecLvl = parseInt(curveDigits[0]);
                    if(firstParam == 'ec'){
                        nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam + "c" + "-" + paramSetID);
                    }
                    else {
                        nistQTsecLvl = NistQTSecLevelClassInstance.getNistQuantumSecLevel(firstParam + "-" + paramSetID);
                    }
                    //relatedCryptoMaterialSize = parseInt(curveDigits[0]);
                } catch (error){
                    console.error(error);
                }
            }
        }
    }
        



    


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
            
        case 'related-crypto-material': 
        component.cryptoProperties.relatedCryptoMaterialProperties = {
            type: undefined, //"public-key", TODO
            id: undefined, //"2e9ef09e-dfac-4526-96b4-d02f31af1b22",
            state: undefined, //"active",
            size: relatedCryptoMaterialSize, //2048,
            algorithmRef: undefined, //"crypto/algorithm/rsa-2048@1.2.840.113549.1.1.1",
            //securedBy: {
            //  mechanism: undefined, //"None"
            //},
            creationDate: undefined, //"2016-11-21T08:00:00Z",
            activationDate: undefined, //"2016-11-21T08:20:00Z"
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