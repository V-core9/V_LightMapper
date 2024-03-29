
const v_lightmapper = async (config) => {


    // ? This is where the actual sitemap URL gets combined...cuz we also need the values separate for additional use cases.
    var $sitemap = null;


    // ? This is the function that returns the sitemap URL or sets it if not already.
    sitemap_path = () => {
        if ($sitemap === null) {
            $sitemap = `${config.protocol}://${config.host}/${config.path}`;
        }
        console.log(`🚩 SitemapURL : ${$sitemap}`);
        return $sitemap;
    };

    const path = require('path');
    const fs = require("fs");
    const lighthouse = require("lighthouse");
    const chromeLauncher = require("chrome-launcher");
    const Sitemapper = require("sitemapper");
    const sitemap = new Sitemapper();
    const mapViewTemplate = require('./lightmap.view.list');
    config.reports_dir = config.reportsDir + '/' + config.host + '/';

    var results = {
        startTime: null,
        endTime: null,
        execTime: null,
        pageRes: []
    };

    var pagesForTest;
    var chromeWorkingStatus = 0;
    var maxParallelNumber = 1;
    var doneItems = 0;
    var lastAppointed = 0;
    var itemNumber = 0;
    var looper;


    stopLooper = async () => {
        results.endTime = Date.now();
        results.execTime = results.endTime - results.startTime;
        console.log("\n🌌 Finished All tasks. Exec.Time : " + results.execTime / 1000 + "s");
        fs.writeFileSync(config.reportsDir + '/' + config.host + '.html', mapViewTemplate(results));
        fs.writeFileSync(config.reportsDir + '/' + config.host + '.json', JSON.stringify(results));
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
        if (config.save_to_file === true) {
            const reportHtml = results.report;
            if (!fs.existsSync(config.reports_dir)) {
                fs.mkdirSync(config.reports_dir);
            }
            fs.writeFileSync(
                `${config.reports_dir}/${pageName}.html`,
                reportHtml
            );
        }
    };

    lh_test = async (pageUrl) => {
        chromeWorkingStatus++;
        lastAppointed++;

        var launchFlags = { chromeFlags: (config.disableHeadlessMode !== true) ? ["--headless", "--max-wait-for-load 3000"] : [], };
        const chrome = await chromeLauncher.launch(launchFlags);
        const options = {
            logLevel: "error",
            output: "html",
            port: chrome.port,
        };

        if (typeof config.onlyCategories !== "undefined") {
            options.onlyCategories = [];
            if (config.onlyCategories.indexOf("accessibility") > -1) options.onlyCategories.push("accessibility");
            if (config.onlyCategories.indexOf("best-practices") > -1) options.onlyCategories.push("best-practices");
            if (config.onlyCategories.indexOf("performance") > -1) options.onlyCategories.push("performance");
            if (config.onlyCategories.indexOf("pwa") > -1) options.onlyCategories.push("pwa");
            if (config.onlyCategories.indexOf("seo") > -1) options.onlyCategories.push("seo");
        }

        const runnerResult = await lighthouse(pageUrl, options);

        var shortData = {
            name: pageUrl,
            perf: (runnerResult.lhr.categories[`performance`] !== undefined) ? runnerResult.lhr.categories[`performance`].score * 100 : 0,
            bp: (runnerResult.lhr.categories[`best-practices`] !== undefined) ? runnerResult.lhr.categories[`best-practices`].score * 100 : 0,
            seo: (runnerResult.lhr.categories[`seo`] !== undefined) ? runnerResult.lhr.categories[`seo`].score * 100 : 0,
            acc: (runnerResult.lhr.categories[`accessibility`] !== undefined) ? runnerResult.lhr.categories[`accessibility`].score * 100 : 0,
            pwa: (runnerResult.lhr.categories[`pwa`] !== undefined) ? runnerResult.lhr.categories[`pwa`].score * 100 : 0
        };

        results.pageRes.push(shortData);

        await saveResult(pageUrl, runnerResult);

        await chrome.kill().then((Result) => {
            chromeWorkingStatus--;
            doneItems++;
            console.log("\n🍾 DONE[url]: " + pageUrl + "  [ " + doneItems + " / " + itemNumber + " ]");
            console.log(shortData);
        });
    };


    results.startTime = Date.now();

    sitemap
        .fetch(sitemap_path())
        .then((sites) => {
            pagesForTest = sites.sites;
            itemNumber = pagesForTest.length;
            console.log(sites);
            looper = setInterval(core, 500);
        });

};

module.exports = v_lightmapper;