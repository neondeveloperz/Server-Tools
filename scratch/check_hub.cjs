const lucide = require('lucide-react');
const keys = Object.keys(lucide);
const hubKeys = keys.filter(k => k.toLowerCase().includes('hub'));
console.log('Hub keys:', hubKeys);
