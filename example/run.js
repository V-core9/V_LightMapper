const path = require('path');
const v_lightmapper = require('../dist');

const initConfig = {
    protocol: "https",
    host: "vyking.com",
    path: "sitemap.xml",
    reportsDir : path.join(__dirname, `../reports/`),
    save_to_file: true,
    headless: true,
    onlyCategories : ["performance"],
    customRootResultTemplate: path.join(__dirname, 'custom_template.view')
};

v_lightmapper(initConfig);
