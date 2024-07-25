
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
import { DiffieHellman, ECDH, createHmac, createPrivateKey, createPublicKey, diffieHellman } from 'node:crypto';

// TEST FILE FOR NODE CRYPTO LIBRARY




// ALGORITHMS
const alg1 = createCipher('algorithm');    // These will produce components
const alg2 = createCipheriv('algorithm');
const alg3 = createDecipheriv('algorithm');
const alg4 = createDecipher('algorithm');
const alg5 = createHash('algorithm');
const alg6 = createHmac('algorithm');
const alg7 = createSign('algorithm');
const alg8 = createVerify('algorithm');
const alg9 = hash('algorithm');
const alg10 = crypto.createCipher(variable1);    // Method calls with variables are excluded currently
const alg11 = crypto.createCipheriv(variable2);
const alg12 = crypto.createDecipheriv('algorithm'); // These are essentially duplicates from the examples above
const alg13 = crypto.createDecipher('algorithm');   // and therefore, will not create their own crypto components
const alg14 = crypto.createHash('algorithm');
const alg15 = crypto.createHmac('algorithm');
const alg16 = crypto.createSign('algorithm');
const alg17 = crypto.createVerify('algorithm');
const alg18 = crypto.hash('algorithm');

// KEYS
const key1 = crypto.createPrivateKey();
const key2 = crypto.createPublicKey();
const key3 = crypto.createSecretKey();
const key4 =  crypto.createDiffieHellman();
const key5 = crypto.createDiffieHellmanGroup();
const key6 =  crypto.getDiffieHellman();
const key7 = crypto.createECDH();
const key8 = crypto.generateKey();
const key9 = crypto.generateKeyPair();
const key10 = crypto.generateKeyPairSync();
const key11 = crypto.generateKeySync();
const key12 = DiffieHellman.generateKeys();
const key13 = ECDH.generateKeys();
const key14 = createPrivateKey();
const key15 = createPublicKey();
const key16 = createSecretKey();
const key17 = createDiffieHellman();
const key18 = createDiffieHellmanGroup();
const key19 = getDiffieHellman();
const key20 = createECDH();
const key21 = generateKey();
const key22 = generateKeyPair();
const key23 = generateKeyPairSync();
const key24 = generateKeySync();
const key25 = generateKeys();


// CERT
const cert1 = new X509Certificate();



//---------------------------------------------- proper test values below -----------------------------------

// Ciphers
const algtest1 = createCipher('aes-128-cbc-hmac-sha256');    
const algtest2 = createCipheriv('aes128');
const algtest3 = createDecipheriv('aes-256-cfb1');
const algtest4 = createDecipher('bf-ecb');
const algtest5 = createCipher('camellia-128-cbc');    
const algtest6 = createCipheriv('blowfish');
const algtest7 = createDecipheriv('des-cbc');
const algtest8 = createDecipher('des-ede3-cfb1');
const algtest9 = createCipher('des3');    
const algtest10 = createCipheriv('id-aes192-wrap');
const algtest11 = createDecipheriv('id-smime-alg-CMS3DESwrap');
const algtest12 = createDecipher('rc4-hmac-md5');
const algtest13 = createCipher('id-aes256-GCM');    
const algtest14 = createCipheriv('rc2-64-cbc');
const algtest15 = createDecipheriv('seed-cbc');
const algtest16 = createDecipher('camellia256');
const algtest17 = createDecipher(2056); // Not a valid value and will not produce a component


//Hashes
const shatest1 = crypto.createCipheriv('RSA-RIPEMD160');
const shatest2 = crypto.createDecipheriv('RSA-SHA1-2');
const shatest3 = crypto.createCipher('RSA-SHA224');
const shatest4 = crypto.createDecipher('RSA-SHA3-256');
const shatest5 = crypto.createSign('RSA-SHA3-384');
const shatest6 = crypto.createVerify('RSA-SHA3-512');
const shatest7 = crypto.createHmac('RSA-SHA384');
const shatest8 = crypto.createHash('RSA-SHA512/224'); 
const shatest9 = crypto.createDiffieHellman('blake2s256');
const shatest10 = crypto.createECDH('id-rsassa-pkcs1-v1_5-with-sha3-256');
const shatest11 = crypto.createSecretKeyBuffer('sha224WithRSAEncryption');
const shatest12 = crypto.createPublicKey('sha3-224');
const shatest13 = crypto.createPrivateKey('sha384WithRSAEncryption');
//const shatest14 = crypto.createX509Certificate('sha512-224WithRSAEncryption'); //Not working yet
const shatest15 = crypto.createDiffieHellman(1024);

//---------------------------------------------- proper test values above -----------------------------------

// Should produce 39 components