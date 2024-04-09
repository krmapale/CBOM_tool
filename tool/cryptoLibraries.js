

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
        
        this.importRegexp = [
            /\bimport\s+\*\s+as\s+crypto\s+from\s+['"]crypto['"]/g, // import * as crypto from 'crypto'
            /\bimport\s+crypto\s+from\s+['"]crypto['"]/g, // import crypto from 'crypto'
            /\bimport\s+{\s*\w+\s*}\s+from\s+['"]crypto['"]/g, // import { "anything" } from 'crypto'
            /\bimport\s+[\w*\s{},]*\s+from\s+['"]crypto['"]/g, // import crypto, { createHash } from 'crypto'
         ];
        this.requireRegexp = /\brequire\s*\(\s*['"]crypto['"]\s*\)/g; // require('crypto')
        
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