const path = require('path');
const v_lightmapper = require('../dist');

const initConfig = {
    protocol: "https",
    host: "vyking.com",
    xmlPath: "sitemap.xml",
    reportsDir : path.join(__dirname, `../reports/`),
    save_to_file: true,
    headless: false,
    //onlyCategories : ["performance"],
    customRootResultTemplate: path.join(__dirname, 'custom_template.view'),
    //doneAfter: 5,
};

v_lightmapper(initConfig);
