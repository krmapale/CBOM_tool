import * as crypto from 'crypto'; 


const alg1 = createCipher('invalidValue');    
const alg2 = createCipheriv('invalidValue');
const alg3 = createDecipheriv('invalidValue');
const alg4 = createDecipher('invalidValue');
const alg5 = createHash('invalidValue');
const alg6 = createHmac('invalidValue');
const alg7 = createSign('invalidValue');
const alg8 = createVerify('invalidValue');
const alg9 = hash('invalidValue');
const alg10 = crypto.createCipher('invalidValue');    
const alg11 = crypto.createCipheriv('invalidValue');
const alg12 = crypto.createDecipheriv('invalidValue');
const alg13 = crypto.createDecipher('invalidValue');
const alg14 = crypto.createHash('invalidValue');
const alg15 = crypto.createHmac('invalidValue');
const alg16 = crypto.createSign('invalidValue');
const alg17 = crypto.createVerify('invalidValue');
const alg18 = crypto.hash('invalidValue');

const algtest1 = createCipher(aes-128-cbc-hmac-sha256);    
const algtest2 = createCipheriv(aes128);
const algtest3 = createDecipheriv(aes-256-cfb1);
const algtest4 = createDecipher(bf-ecb);
const algtest5 = createCipher(camellia-128-cbc);    
const algtest6 = createCipheriv(blowfish);
const algtest7 = createDecipheriv(des-cbc);
const algtest8 = createDecipher(des-ede3-cfb1);
const algtest9 = createCipher(des3);    
const algtest10 = createCipheriv(id-aes192-wrap);
const algtest11 = createDecipheriv(id-smime-alg-CMS3DESwrap);
const algtest12 = createDecipher(rc4-hmac-md5);
const algtest13 = createCipher(id-aes256-GCM);    
const algtest14 = createCipheriv(rc2-64-cbc);
const algtest15 = createDecipheriv(seed-cbc);
const algtest16 = createDecipher(camellia256);



const shatest1 = crypto.createCipheriv(RSA-RIPEMD160)
const shatest2 = crypto.createDecipheriv(RSA-SHA1-2)
const shatest3 = crypto.createCipher(RSA-SHA224)
const shatest4 = crypto.createDecipher(RSA-SHA3-256)
const shatest5 = crypto.createSign(RSA-SHA3-384)
const shatest6 = crypto.createVerify(RSA-SHA3-512)
const shatest7 = crypto.createHmac(RSA-SHA384)
const shatest8 = crypto.createHash(RSA-SHA512/224)
const shatest9 = crypto.createDiffieHellman(blake2s256)
const shatest10 = crypto.createECDH(id-rsassa-pkcs1-v1_5-with-sha3-256)
const shatest11 = crypto.createSecretKeyBuffer(sha224WithRSAEncryption)
const shatest12 = crypto.createPublicKey(sha3-224)
const shatest13 = crypto.createPrivateKey(sha384WithRSAEncryption)
const shatest14 = crypto.createX509Certificate(sha512-224WithRSAEncryption)