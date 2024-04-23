

/*
const testArray = [
    'crypto.createPrivateKey(\'asdasdad\')', //match
    'crypto.createPrivateKey(\'asda-sdad\')', //match
    'crypto.createPrivateKey(\'a-12512\')', //match
    'crypto.createPrivateKey(\'33-sdad\')', //match
    'crypto.createPrivateKey(\'123\')', //match
    'crypto.createPrivateKey(\'sha215\')', //match
    'crypto.createPrivateKey(\'RSA-AES\')', //match
    'crypto.createPrivateKey(\'aes-128-ccm\')', //match
    //--------------------------------------------------------------
    ' createPrivateKey(asdasdasd', //no match
    '.createPrivateKey(asddd', //no match
    'createPrivateKey(asdasdasd', //no match
    'crypto.createPrivateKey(asdasdad)', //no match
    'Crypto.CreatePrivateKey(asdasdas)', // no match
    'dddddcreatePrivateKey(asdasdasd', //no match
    'diffieHellman.generateKeys([encoding])', //no match
    'ecdh.generateKeys([encoding[, format]])', //no match
    'createDiffieHellman(2048)', //no match
    'crypto.createDiffieHellmanGroup(name)' // no match
]

const element = 'createPrivateKey';
const tmpRegexp = new RegExp(`((^(crypto|diffieHellman|ecdh)\\.)|\\s*)\\b${element}\\('(\\w+)(-(\\w*))*'`, 'g');


testArray.forEach(stringElement => {
    if(stringElement.match(tmpRegexp)){
        console.log('-MATCH- ' ,stringElement.match(tmpRegexp));
    }
    else {
        console.log('-NO MATCH- ' + stringElement);
    }
    
});
let string1 = "\'asdasd\'";

if(string1.match(/^\'(\w+)(-(\w*))*\'$/)){
    console.log('match! : ' + string1);
    string1 = string1.replaceAll(/\'|\"/g , '');
    console.log('removed quotes! : ' + string1);
}
else{
    console.log('no match');
}


let digits = 'asd123dsa';

if(digits.match(/\d+/g)){
    console.log('match! : ' + digits.match(/\d+/g));
}*/



const crypto = require('crypto');
let ciphers = crypto.getCiphers();

ciphers.forEach(element => {
    testGetCiphers(element, ciphers);
});


//testGetCiphers('aes256-wrap', ciphers);



function testGetCiphers(regexpMatchString, ciphers){

let paramSetID = undefined;
let classicalSecLvl = undefined;
let nistQTsecLvl = undefined;
let algorithmMode = undefined;


for (let cipher of ciphers){
    if(cipher.match(regexpMatchString)){
        console.log('match found! ' + regexpMatchString + ' : ' + regexpMatchString.match(cipher));
        //console.log(cipher);
        //let cipherString = cipher.replaceAll(/\'|\"/g , '');
        if(cipherString.includes('-')){
            const splitCipher = cipher.split('-');
            console.log(splitCipher[0]);
            console.log(splitCipher[1]);
            if(splitCipher[1].match(/\d{3,}/g)){
                paramSetID = splitCipher[1].match(/\d{3,}/g);
                classicalSecLvl = parseInt(paramSetID);
            }
            if(splitCipher.length > 2){
                algorithmMode = splitCipher[2];
            }
            if(splitCipher[0].match(/aes\d{3,}/g) && splitCipher[1].match(/wrap/g)){
                paramSetID = splitCipher[0].match(/\d{3}/g);
                classicalSecLvl = parseInt(paramSetID);
                algorithmMode = splitCipher[1];
            }
        }
        else{
            if(cipherString.match(/\d{3,}/g)){
                paramSetID = cipherString.match(/\d{3,}/g);
                classicalSecLvl = parseInt(paramSetID);
            }
        }
        break;
    }
}


console.log('Search string : ' + regexpMatchString);
console.log('Parameter set identifier : ' + paramSetID);
console.log('Classical security level : ', classicalSecLvl);
console.log('Algorithm mode : ' + algorithmMode);

}
