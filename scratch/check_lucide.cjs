const lucide = require('lucide-react');
const keys = Object.keys(lucide);
const githubKeys = keys.filter(k => k.toLowerCase().includes('git'));
console.log('GitHub/Git keys:', githubKeys);
const searchKeys = keys.filter(k => k.toLowerCase().includes('search'));
console.log('Search keys:', searchKeys);
const allKeys = keys.slice(0, 100);
console.log('Sample keys:', allKeys);
