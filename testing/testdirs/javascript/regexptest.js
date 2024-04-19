

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
const tmpRegexp = new RegExp(`(((crypto|diffieHellman|ecdh)\\.)|\\s*)\\b${element}\\('(\\w+)(-(\\w*))*'`, 'g');


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
*/

let digits = 'asd123dsa';

if(digits.match(/\d+/g)){
    console.log('match! : ' + digits.match(/\d+/g));
}