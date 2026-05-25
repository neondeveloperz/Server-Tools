const lucide = require('lucide-react');
const icons = [
  'TerminalIcon', 'SearchIcon', 'SunIcon', 'MoonIcon', 'InfoIcon', 
  'ArrowLeftIcon', 'ArrowRightIcon', 'MinusIcon', 'SquareIcon', 'XIcon', 
  'PanelLeftCloseIcon', 'PanelLeftIcon', 'SettingsIcon', 'GlobeIcon', 
  'FolderOpenIcon', 'SparklesIcon', 'LayersIcon', 'FlameIcon', 'CommandIcon'
];
icons.forEach(icon => {
  console.log(`${icon}: ${!!lucide[icon]}`);
});
