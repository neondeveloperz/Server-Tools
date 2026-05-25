const lucide = require('lucide-react');
const icons = [
  'ServerIcon', 'CloudIcon', 'KeyIcon', 'ShieldCheckIcon', 'ClockIcon', 'TerminalIcon', 'NetworkIcon', 'CpuIcon'
];
icons.forEach(icon => {
  console.log(`${icon}: ${!!lucide[icon]}`);
});
