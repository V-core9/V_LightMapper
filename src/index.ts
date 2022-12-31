import { V_Lightmapper_Config, InnerOption, ResultsObject, ShortDataInterface, } from '..';

const v_lightmapper = async (config: V_Lightmapper_Config) => {

  const { log, info, warn, error } = console;

  // ? This is where the actual sitemap URL gets combined...cuz we also need the values separate for additional use cases.
  let $sitemap: null | any = null;

  // ? This is the function that returns the sitemap URL or sets it if not already.
  const sitemap_path = () => {
    if ($sitemap === null) {
      $sitemap = `${config.protocol}://${config.host}/${config.path}`;
    }
    info(`🚩 SitemapURL : ${$sitemap}`);
    return $sitemap;
  };

  const path = require('path');
  const fs = require("fs");
  const lighthouse = require("lighthouse");
  const chromeLauncher = require("chrome-launcher");
  const Sitemapper = require("sitemapper");
  const sitemap = new Sitemapper();
  const mapViewTemplate = require(!config.customRootResultTemplate ? './base.view' : config.customRootResultTemplate);
  config.reports_dir = config.reportsDir + '/' + config.host + '/';

  let results: ResultsObject = {
    startTime: null,
    endTime: null,
    execTime: null,
    pageRes: []
  };

  let pagesForTest: any;
  let chromeWorkingStatus = 0;
  let maxParallelNumber = 1;
  let doneItems = 0;
  let lastAppointed = 0;
  let itemNumber = 0;
  let looper: any;


  const stopLooper = async () => {
    results.endTime = Date.now();
    results.execTime = results.endTime - (results.startTime || 0);
    warn("\n🌌 Finished All tasks. Exec.Time : " + results.execTime / 1000 + "s");
    fs.writeFileSync(config.reportsDir + '/' + config.host + '.html', mapViewTemplate(results));
    fs.writeFileSync(config.reportsDir + '/' + config.host + '.json', JSON.stringify(results));
    clearInterval(looper);
  };

  const core = async () => {
    if (lastAppointed < itemNumber && chromeWorkingStatus < maxParallelNumber) {
      await lh_test(pagesForTest[lastAppointed]);
    } else if (doneItems == itemNumber) {
      await stopLooper();
    }
  };

  const getPageName = async (pageUrl: string) => {
    if (pageUrl[pageUrl.length - 1] != "/") {
      pageUrl = pageUrl + "/";
    }
    var helper = pageUrl.split("/");
    return helper[helper.length - 2];
  };

  const saveResult = async (pageUrl: string, results: any) => {
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

  const lh_test = async (pageUrl: string) => {
    chromeWorkingStatus++;
    lastAppointed++;

    var launchFlags = { chromeFlags: (config.disableHeadlessMode !== true) ? ["--headless", "--max-wait-for-load 3000"] : [], };
    const chrome = await chromeLauncher.launch(launchFlags);
    const options: InnerOption = {
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

    let shortData: ShortDataInterface = {
      name: pageUrl,
      perf: (runnerResult.lhr.categories[`performance`] !== undefined) ? runnerResult.lhr.categories[`performance`].score * 100 : 0,
      bp: (runnerResult.lhr.categories[`best-practices`] !== undefined) ? runnerResult.lhr.categories[`best-practices`].score * 100 : 0,
      seo: (runnerResult.lhr.categories[`seo`] !== undefined) ? runnerResult.lhr.categories[`seo`].score * 100 : 0,
      acc: (runnerResult.lhr.categories[`accessibility`] !== undefined) ? runnerResult.lhr.categories[`accessibility`].score * 100 : 0,
      pwa: (runnerResult.lhr.categories[`pwa`] !== undefined) ? runnerResult.lhr.categories[`pwa`].score * 100 : 0
    };

    results.pageRes.push(shortData);

    await saveResult(pageUrl, runnerResult);

    await chrome.kill().then((Result: unknown) => {
      chromeWorkingStatus--;
      doneItems++;
      log("\n🍾 DONE[url]: " + pageUrl + "  [ " + doneItems + " / " + itemNumber + " ]");
      log(shortData);
    });
  };


  results.startTime = Date.now();

  sitemap
    .fetch(sitemap_path())
    .then((sites: any) => {
      pagesForTest = sites.sites;
      itemNumber = pagesForTest.length;
      log(sites);
      looper = setInterval(core, 500);
    });

};

module.exports = v_lightmapper;

export default v_lightmapper;
