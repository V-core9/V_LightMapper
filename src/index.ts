import { V_LightMapper_Interface, InnerOption, ResultsObject, ShortDataInterface, } from '..';

const v_lightmapper = async (config: V_LightMapper_Interface) => {
  const {
    protocol,
    host,
    xmlPath,
    customRootResultTemplate,
    reportsDir,
    save_to_file,
    headless,
    onlyCategories,
    doneAfter
  } = config;

  const { log, info, warn, error } = console;

  // ? This is where the actual sitemap URL gets combined...cuz we also need the values separate for additional use cases.
  let $sitemap: null | any = null;

  // ? This is the function that returns the sitemap URL or sets it if not already.
  const sitemap_path = () => {
    if ($sitemap === null) {
      $sitemap = `${protocol}://${host}/${xmlPath}`;
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
  const mapViewTemplate = require(!customRootResultTemplate ? './base.view' : customRootResultTemplate);
  config.reports_dir = reportsDir + '/' + host + '/';

  let results: ResultsObject = {
    config: config,
    startTime: null,
    endTime: null,
    execTime: null,
    pageRes: []
  };

  let pagesForTest: any;
  let chromeWorkingStatus = 0;
  const maxParallelNumber = 1;
  let doneItems = 0;
  let lastAppointed = 0;
  let itemNumber = 0;
  let looper: any;


  const stopLooper = async () => {
    results.endTime = Date.now();
    results.execTime = results.endTime - (results.startTime || 0);
    warn("\n🌌 Finished All tasks. Exec.Time : " + results.execTime / 1000 + "s");
    fs.writeFileSync(reportsDir + '/' + host + '.html', mapViewTemplate(results));
    fs.writeFileSync(reportsDir + '/' + host + '.json', JSON.stringify(results));
    clearInterval(looper);
  };

  const core = async () => {
    if (doneAfter === doneItems) return await stopLooper();
    if (lastAppointed < itemNumber && chromeWorkingStatus < maxParallelNumber) {
      await lighthouseTestURL(pagesForTest[lastAppointed]);
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
    if (save_to_file === true) {
      const reportHtml = results.report;

      const { reports_dir } = config;

      if (!fs.existsSync(reports_dir)) fs.mkdirSync(reports_dir);

      fs.writeFileSync(`${reports_dir}/${pageName}.html`, reportHtml);
    }
  };

  const lighthouseTestURL = async (pageUrl: string) => {
    chromeWorkingStatus++;
    lastAppointed++;

    let launchFlags = {
      chromeFlags: ["--max-wait-for-load 3000"],
    };

    if (headless === true) launchFlags.chromeFlags = ["--headless", ...launchFlags.chromeFlags]

    const chrome = await chromeLauncher.launch(launchFlags);

    const options: InnerOption = {
      logLevel: "error",
      output: "html",
      port: chrome.port,
    };

    if (!!onlyCategories) options.onlyCategories = [...onlyCategories];


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
