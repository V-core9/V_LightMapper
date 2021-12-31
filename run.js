const vLM = require('.');
const vFS = require('v_file_system');

vLM(JSON.parse(vFS.readSy('./config.json')));