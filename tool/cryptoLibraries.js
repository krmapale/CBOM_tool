

export class NodeCrypto {
    constructor() {
        this.classes = [ // <below class>.<some method> etc //TODO: think about class.method-combos that are relevant. Like sign, generateKey.. etc?
            'cipher',
            'decipher',
            'diffieHellman',
            'ecdh',
            'ECDH',
            'hash',
            'hmac',
            'KeyObject',
            'keyObject',
            'sign',
            'verify',
            'new X509Certificate',
            'x509',
            'crypto',
        ];

        this.algorithm = [               //methods
            'createCipher',              //crypto.createCipher('algorithm', ..)     these can be used without `crypto.` when imported
            'createCipheriv',            //crypto.createCipheriv('algorithm', ..)
            'createDecipheriv',          //createDecipheriv('algorithm', ...)
            'createDecipher',            //createDecipher('algorithm', ...)
            'createHash',                //crypto.createHash(algorithm[, options])
            'createHmac',                //crypto.createHmac(algorithm, key[, options])
            'createSign',                //crypto.createSign(algorithm[, options])
            'createVerify',              //crypto.createVerify(algorithm[, options])
            'hash',                      //crypto.hash(algorithm, data[, outputEncoding])
        ]

        this.relatedCryptoMaterial = [   // keys
            'createPrivateKey',          //crypto.createPrivateKey(key)
            'createPublicKey',           //crypto.createPublicKey(key)
            'createSecretKey',           //crypto.createSecretKey(key[, encoding])
            'createDiffieHellman',       // createDiffieHellman(2048)
            'createDiffieHellmanGroup',  //crypto.createDiffieHellmanGroup(name)
            'getDiffieHellman',          // crypto.getDiffieHellman(groupName)
            'createECDH',                //crypto.createECDH(curveName)
            'generateKey',               //crypto.generateKey(type, options, callback)
            'generateKeyPair',           //crypto.generateKeyPair(type, options, callback)
            'generateKeyPairSync',       //crypto.generateKeyPairSync(type, options)
            'generateKeySync',           //crypto.generateKeySync(type, options)
        ]
        
        this.importRegexp = [
            /\bimport\s+\*\s+as\s+crypto\s+from\s+['"][node:]?crypto['"]/g, // import * as crypto from 'crypto'
            /\bimport\s+crypto\s+from\s+['"][node:]?crypto['"]/g, // import crypto from 'crypto'
            /\bimport\s+{\s*\w+\s*}\s+from\s+['"][node:]?crypto['"]/g, // import { "anything" } from 'crypto'
            /\bimport\s+[\w*\s{},]*\s+from\s+['"][node:]?crypto['"]/g, // import crypto, { createHash } from 'crypto'
         ];
        this.requireRegexp = /\brequire\s*\(\s*['"][node:]?crypto['"]\s*\)/g; // require('crypto')
        
    }
}

export class WebCryptoAPI { 
    constructor() {
        this.methods = [ // window.crypto.subtle.<below method>
        '.generateKey(',    // SubtleCrypto.<below method>
        '.deriveKey(',
        '.importKey(',
        '.exportKey(',
        '.wrapKey(',
        '.unwrapKey(',
        '.encrypt(',
        '.decrypt(',
        '.sign(',
        '.verify('
    ];
    }
}