


const crypto1 = require('node:crypto');
const fs1 = require('node:fs');
fs1.writeFile('getCurvesList', JSON.stringify(crypto1.getCurves(), false, 2), (err) => {
    if(err) throw err;
});