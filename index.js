
const path = require('path');
const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const Sitemapper = require("sitemapper");
const sitemap = new Sitemapper();
const sitemapToScan = require("./config-sitemap");
const reports_dirname = path.join(__dirname, `reports/${sitemapToScan.config.host}`);
const mapViewTemplate = require('./report.sitemap.template');
var results = [];
var pagesForTest;
var chromeWorkingStatus = 0;
var maxParallelNumber = 1;
var doneItems = 0;
var lastAppointed = 0;
var itemNumber = 0;
var looper;


stopLooper = async () => {
    console.log("\n🌌 Finished All tasks.");
    fs.writeFileSync('mapViewTemplate-' + sitemapToScan.config.host + '.html', mapViewTemplate(results));
    clearInterval(looper);
};

core = async () => {
    if (lastAppointed < itemNumber && chromeWorkingStatus < maxParallelNumber) {
        await lh_test(pagesForTest[lastAppointed]);
    } else if (doneItems == itemNumber) {
        await stopLooper();
    }
};

getPageName = async (pageUrl) => {
    if (pageUrl[pageUrl.length - 1] != "/") {
        pageUrl = pageUrl + "/";
    }
    var helper = pageUrl.split("/");
    return helper[helper.length - 2];
};

saveResult = async (pageUrl, results) => {
    var pageName = await getPageName(pageUrl);
    if (sitemapToScan.config.save_to_file === true) {
        const reportHtml = results.report;
        if (!fs.existsSync(reports_dirname)) {
            fs.mkdirSync(reports_dirname);
        }
        fs.writeFileSync(
            `${reports_dirname}/${pageName}.html`,
            reportHtml
        );
    }
};

lh_test = async (pageUrl) => {
    chromeWorkingStatus++;
    lastAppointed++;

    var launchFlags = { chromeFlags: (sitemapToScan.config.disableHeadlessMode !== true) ? ["--headless"] : [], };
    const chrome = await chromeLauncher.launch(launchFlags);
    const options = {
        logLevel: "error",
        output: "html",
        port: chrome.port,
    };

    if (typeof sitemapToScan.config.onlyCategories !== "undefined") {
        options.onlyCategories = [];
        if (sitemapToScan.config.onlyCategories.indexOf("accessibility") > -1) options.onlyCategories.push("accessibility");
        if (sitemapToScan.config.onlyCategories.indexOf("best-practices") > -1) options.onlyCategories.push("best-practices");
        if (sitemapToScan.config.onlyCategories.indexOf("performance") > -1) options.onlyCategories.push("performance");
        if (sitemapToScan.config.onlyCategories.indexOf("pwa") > -1) options.onlyCategories.push("pwa");
        if (sitemapToScan.config.onlyCategories.indexOf("seo") > -1) options.onlyCategories.push("seo");
    }

    const runnerResult = await lighthouse(pageUrl, options);

    var shortData = {
        name: pageUrl,
        perf: runnerResult.lhr.categories[`performance`].score * 100,
        bp: runnerResult.lhr.categories[`best-practices`].score * 100,
        seo: runnerResult.lhr.categories[`seo`].score * 100,
        acc: runnerResult.lhr.categories[`accessibility`].score * 100,
        pwa: runnerResult.lhr.categories[`pwa`].score * 100
    };
    results.push(shortData);

    await saveResult(pageUrl, runnerResult);

    await chrome.kill().then((Result) => {
        console.log("\n🍾 DONE[url]: " + pageUrl + "  [ " + doneItems + " / " + itemNumber + " ]");
        console.log(shortData);
        chromeWorkingStatus--;
        doneItems++;
    });
};


const v_lightmapper = async () => {

    sitemap
        .fetch(sitemapToScan.sitemap())
        .then((sites) => {
            pagesForTest = sites.sites;
            itemNumber = pagesForTest.length;
            console.log(sites);
            looper = setInterval(core, 500);
        });

};

module.exports = v_lightmapper;