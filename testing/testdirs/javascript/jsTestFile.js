

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

const crypto = require('crypto');


// ALGORITHMS
const alg1 = createCipher('algorithm');    
const alg2 = createCipheriv('algorithm');
const alg3 = createDecipheriv('algorithm');
const alg4 = createDecipher('algorithm');
const alg5 = createHash('algorithm');
const alg6 = createHmac('algorithm');
const alg7 = createSign('algorithm');
const alg8 = createVerify('algorithm');
const alg9 = hash('algorithm');
const alg10 = crypto.createCipher('algorithm');    
const alg11 = crypto.createCipheriv('algorithm');
const alg12 = crypto.createDecipheriv('algorithm');
const alg13 = crypto.createDecipher('algorithm');
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

