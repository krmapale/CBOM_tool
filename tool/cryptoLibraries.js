

export class NodeCrypto {
    constructor() {
        this.classes = [ // <below class>.<some method> etc
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
        
        this.importRegexp = /\bimport\s+\*\s+as\s+crypto\s+from\s+['"]crypto['"]|\bimport\s+\*\s+as\s+crypto\s+from\s+['"]crypto['"]/g; // TODO: continue
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