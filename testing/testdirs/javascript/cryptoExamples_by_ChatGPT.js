const crypto = require('crypto');

// Example: createCipher (Deprecated)
try {
    const cipher = crypto.createCipher('aes192', 'a password');
    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log('Encrypted (createCipher):', encrypted);
} catch (err) {
    console.error('Error (createCipher):', err.message);
}

// Example: createCipheriv
const iv = crypto.randomBytes(16);
const key = crypto.randomBytes(32); // AES-256 requires a 256-bit key (32 bytes)
const cipheriv = crypto.createCipheriv('aes-256-cbc', key, iv);
let encryptediv = cipheriv.update('some clear text data', 'utf8', 'hex');
encryptediv += cipheriv.final('hex');
console.log('Encrypted (createCipheriv):', encryptediv);

// Example: createDecipheriv
const decipheriv = crypto.createDecipheriv('aes-256-cbc', key, iv);
let decryptediv = decipheriv.update(encryptediv, 'hex', 'utf8');
decryptediv += decipheriv.final('utf8');
console.log('Decrypted (createDecipheriv):', decryptediv);

// Example: createDecipher (Deprecated)
try {
    const decipher = crypto.createDecipher('aes192', 'a password');
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('Decrypted (createDecipher):', decrypted);
} catch (err) {
    console.error('Error (createDecipher):', err.message);
}

// Example: createHash
const hash = crypto.createHash('sha256').update('some data to hash').digest('hex');
console.log('Hash (createHash):', hash);

// Example: createHmac
const hmac = crypto.createHmac('sha256', 'a secret key').update('some data to hash').digest('hex');
console.log('HMAC (createHmac):', hmac);

// Example: createSign
const sign = crypto.createSign('SHA256');
sign.update('some data to sign');
const privateKey = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
}).privateKey;
const signature = sign.sign(privateKey, 'hex');
console.log('Signature (createSign):', signature);

// Example: createVerify
const verify = crypto.createVerify('SHA256');
verify.update('some data to sign');
const publicKey = crypto.createPublicKey(privateKey);
const isVerified = verify.verify(publicKey, signature, 'hex');
console.log('Verified (createVerify):', isVerified);

// Example: createPrivateKey
const privateKeyObj = crypto.createPrivateKey(privateKey);
console.log('Private Key Object:', privateKeyObj);

// Example: createPublicKey
const publicKeyObj = crypto.createPublicKey(publicKey);
console.log('Public Key Object:', publicKeyObj);

// Example: createSecretKey
const secretKey = crypto.createSecretKey(crypto.randomBytes(32));
console.log('Secret Key:', secretKey);

// Example: createDiffieHellman
const diffieHellman = crypto.createDiffieHellman(2048);
diffieHellman.generateKeys();
console.log('Diffie-Hellman Public Key:', diffieHellman.getPublicKey('hex'));

// Example: createDiffieHellmanGroup
const diffieHellmanGroup = crypto.createDiffieHellmanGroup('modp14');
const dh2 = diffieHellmanGroup.generateKeys();
console.log('Diffie-Hellman Group Public Key:', diffieHellmanGroup.getPublicKey('hex'));

// Example: getDiffieHellman
const getDiffieHellman = crypto.getDiffieHellman('modp14');
const dh3 = getDiffieHellman.generateKeys();
console.log('Get Diffie-Hellman Public Key:', getDiffieHellman.getPublicKey('hex'));

// Example: createECDH
const ecdh = crypto.createECDH('secp256k1');
ecdh.generateKeys();
console.log('ECDH Public Key:', ecdh.getPublicKey('hex'));

// Example: generateKey
crypto.generateKey('hmac', { length: 256 }, (err, key) => {
    if (err) throw err;
    console.log('Generated Key (generateKey):', key.export().toString('hex'));
});

// Example: generateKeyPair
crypto.generateKeyPair('rsa', {
    modulusLength: 2048,
}, (err, publicKey, privateKey) => {
    if (err) throw err;
    console.log('Generated Key Pair (generateKeyPair) Public Key:', publicKey.export({ type: 'pkcs1', format: 'pem' }));
    console.log('Generated Key Pair (generateKeyPair) Private Key:', privateKey.export({ type: 'pkcs1', format: 'pem' }));
});

// Example: generateKeyPairSync
const { publicKey: pubKeySync, privateKey: privKeySync } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});
console.log('Generated Key Pair Sync (generateKeyPairSync) Public Key:', pubKeySync.export({ type: 'pkcs1', format: 'pem' }));
console.log('Generated Key Pair Sync (generateKeyPairSync) Private Key:', privKeySync.export({ type: 'pkcs1', format: 'pem' }));

// Example: generateKeySync
try {
    const keySync = crypto.generateKeySync('hmac', { length: 256 });
    console.log('Generated Key Sync (generateKeySync):', keySync.export().toString('hex'));
} catch (err) {
    console.error('Error (generateKeySync):', err.message);
}

// contains 21 cryptographic components. 4 with unreadable parameters and 1 duplicate.
// Therefore 16 crypto components are to be exptected. 
