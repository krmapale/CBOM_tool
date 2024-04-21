
/*
import fs from 'node:fs';
import path from 'node:path'; 
import { argv } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import crypto from 'crypto';
import * as crypto from 'crypto';
import { createHash } from 'crypto';
import { createHash as ch } from 'crypto';
import crypto, { createHash } from 'crypto';
import { stringify } from 'node:querystring';
*/


const crypto = require('crypto');


class NistQuantumSecLevel{
    constructor(){
        this.levelZero = {
            level : 0,
            algorithms : [ // very weak
            // < AES 128, DES, SHA-224, RSA/DH-2048, ECC 224,
            'DES',
            'SHA-224',
            'RSA-2048',
            'DH-2048',
            'ECC-224'
            ]
        }
        this.levelOne = {
            level : 1,
            algorithms : [ // weak
                'AES128',
                'AES-128',
                'KYBER-512',
                'RSA-3072',
                'DH-3072',
                'ECC-256'        
            ]
        } 

        this.levelTwo = {
            level : 2, 
            algorithms : [ // strong  
                'SHA256',
                'SHA3-256',
            ]
        }

        this.levelThree = {
            level : 3,
            algorithms : [ // stonger
                'AES192',
                'AES-192',
                'KYBER-768',
                'RSA-7068',
                'DH-7068',
                'ECC-384'
            ]
        }

        this.levelFour = {
            level : 4,
            algorithms : [ // very strong
                'SHA384',
                'SHA3-384'
            ]
        }

        this.levelFive = {
            level : 5,
            algorithms : [ // strongest
                'AES256',
                'AES-256',
                'KYBER-1024',
                'ECC-512',
                'SHA-512'
            ]
        } 
        this.levelSix = {
            level : 6,
            algorithms : [ // ?
                // ?
            ]
        } 
    }
}

const nistQTsecLvl = new NistQuantumSecLevel();


console.log('Property key: ' + Object.keys(nistQTsecLvl.levelZero)[0] + ', property value: ' , nistQTsecLvl.levelZero.level);
console.log('Property key: ' + Object.keys(nistQTsecLvl.levelZero)[1] + ', property values: ', JSON.stringify(nistQTsecLvl.levelZero.algorithms));

