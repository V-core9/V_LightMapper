module.exports = {

    // ? Config gets set with data from [ <root> / sitemap-scanner.config.js ] file that is root
    config: require('./lightmapper.cfg'),


    // ? This is where the actual sitemap URL gets combined...cuz we also need the values separate for additional use cases.
    $sitemap: null,


    // ? This is the function that returns the sitemap URL or sets it if not already.
    sitemap() {
        if (this.$sitemap === null) {
            this.$sitemap = `${this.config.protocol}://${this.config.host}/${this.config.path}`;
        }
        console.log(`🚩 SitemapURL : ${this.$sitemap}`);
        return this.$sitemap;
    }

};
