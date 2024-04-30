const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;
const {
    generateKeyPairSync,
    generateKey,
    getDiffieHellman,
    createSign,
    createVerify,
  } = require('node:crypto');


(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Prints: 32 (symmetric key size in bytes)
})();

// crypto.getCurves() returns all the supported curve types
const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'sect239k1',
  });


  const { privateKey1, publicKey1 } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });


  generateKey('hmac', { length: 512 }, (err, key) => {
    if (err) throw err;
    console.log(key.export().toString('hex'));  // 46e..........620
  });


  generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'top secret',
    },
  }, (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
  });



  const {
    publicKey2,
    privateKey2,
  } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'top secret',
    },
  });


const key = generateKeySync('hmac', { length: 512 });


// DiffieHellman
//'modp14' (2048 bits, RFC 3526 Section 3)
//'modp15' (3072 bits, RFC 3526 Section 4)
//'modp16' (4096 bits, RFC 3526 Section 5)
//'modp17' (6144 bits, RFC 3526 Section 6)
//'modp18' (8192 bits, RFC 3526 Section 7)
//The following groups are still supported but deprecated (see Caveats):
//
//'modp1' (768 bits, RFC 2409 Section 6.1) 
//'modp2' (1024 bits, RFC 2409 Section 6.2) 
//'modp5' (1536 bits, RFC 3526 Section 2) 

const alice = getDiffieHellman('modp14'); //
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);


//type: <string> Must be 'rsa', 'rsa-pss', 'dsa', 'ec', 'ed25519', 'ed448', 'x25519', 'x448', or 'dh'.
//modulusLength: <number> Key size in bits (RSA, DSA).
//hashAlgorithm: <string> Name of the message digest (RSA-PSS).
//namedCurve: <string> Name of the curve to use (EC).
//primeLength: <number> Prime length in bits (DH).
//groupName: <string> Diffie-Hellman group name (DH). See crypto.getDiffieHellman().

const privateKey3 = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1', // Using the Bitcoin curve for demonstration
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8', // Encodes private key in PKCS#8 format
        format: 'pem'
    }
}).privateKey;

const privateKeyDSA = crypto.generateKeyPairSync('dsa', {
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8', // Encodes private key in PKCS#8 format
        format: 'pem'
    }
}).privateKey;

const privateKeyRSA = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Key length
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8', // Encodes private key in PKCS#8 format
        format: 'pem'
    }
}).privateKey;