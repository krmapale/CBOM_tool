#! /usr/bin/env node

import {readFile, writeFile} from "node:fs";


process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });


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
    },
    components: [

    ]
}

// Function call
let bomfile = createBomFile(bomObj);

/**
 * Create bom.json file.
 * @param {Javascript bom-object} bomObj 
 */
function createBomFile(bomObj){
    const filename = "bom.json";
    
    writeFile(filename, JSON.stringify(bomObj, false, 2), (err) => {
        if (err) throw err;
        console.log("file " + filename + " created!");
    });

    readFile(filename, 'utf-8' ,(err, data) => {
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