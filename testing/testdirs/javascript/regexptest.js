

const string1 = ' createPrivateKey(asdasdasd';
const string2 = '.createPrivateKey(asddd';
const string3 = 'createPrivateKey(asdasdasd';

const element = 'createPrivateKey';
const tmpRegexp = new RegExp(`\\b\\.?\\s*${element}\\(`, 'g');

console.log(string1.match(tmpRegexp));
console.log(string2.match(tmpRegexp));
console.log(string3.match(tmpRegexp));