
export class NistQuantumSecLevel{
    constructor(){
        this.levelZero = {
            level : 0,
            algorithms : [ // very weak
            // < AES 128, DES, SHA-224, RSA/DH-2048, ECC 224,
            'DES',
            'SHA224',
            'SHA-224',
            'SHA3-224',
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
        //TODO: this whole list needs more algorithms and the search needs to be modified to automatically
        // check the value regardless of char ´-´
        this.levelTwo = {
            level : 2, 
            algorithms : [ // strong  
                'SHA256',
                'SHA-256',
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
                'SHA-384',
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
                'SHA512',
                'SHA-512',
                'SHA3-512'
            ]
        } 
        this.levelSix = {
            level : 6,
            algorithms : [ // ?
                // ?
            ]
        } 
    }

    getNistQuantumSecLevel(firstParam) {
        for(let propertyName of Object.getOwnPropertyNames(this)){
            for(let algorithm of this[propertyName].algorithms){
                if(firstParam.match(new RegExp(`${algorithm}`, 'i'))){
                    return this[propertyName]['level'];
                }
            }
        }
        return undefined;
    }
}

