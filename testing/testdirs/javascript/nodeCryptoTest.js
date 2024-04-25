


const crypto1 = require('node:crypto');
const fs1 = require('node:fs');
fs1.writeFile('getHashesList', JSON.stringify(crypto1.getHashes(), false, 2), (err) => {
    if(err) throw err;
});