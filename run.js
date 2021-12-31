const path = require('path');
const v_lightmapper = require('.');

const config = {
    protocol: "https",
    host: "v-core9.com",
    path: "sitemap_index.xml",
    reportsDir : path.join(__dirname, `reports/`),
    save_to_file: true,
    disableHeadlessMode: false,
    onlyCategories : ["performance"]
};

v_lightmapper(config);