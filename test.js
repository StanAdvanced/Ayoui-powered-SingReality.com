const fs = require('fs');
console.log('/app', fs.readdirSync('/app'));
console.log('/workspace', fs.readdirSync('/workspace'));
console.log('/home/workspace', fs.existsSync('/home/workspace') ? fs.readdirSync('/home/workspace') : 'no');
console.log('/app/applet', fs.readdirSync('/app/applet'));
