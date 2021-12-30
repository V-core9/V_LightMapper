//?  Sitemap Lighthouse Scanner Settings
//?  This is the file we need to set for the sitemap - scanner to work properly.
// 
//!  - -[ <root> / sitemap-scanner.config.js ] - - - - - - - - - - - - - - - - - - - -
//*  module.exports = {
//*    protocol: "https",
//*    host: "v-core9.com",
//*    path: "sitemap_index.xml",
//*    onlyCategories : ["performance"],  
//*  };
//!  - - - - - - - - - - - - - - - - - - - - - - <[ EOF ]>- - - - - - - - - 
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
//? Options Info: 
//[📌]|> protocol                      - "http" || "https"                                                                <- [REQUIRED] Just a protocol to use when referring to 
//[📌]|> host                             -    "localhost:8080" || "random-host"                                <- [REQUIRED] Domain / Host .... adding port if local
//[📌]|> path                            -    "sitemap_index.xml"                                                     <- [REQUIRED] Relative location of the sitemap file
//[🔀]|> disableHeadlessMode  -    true || false || undefined                                                <- [OPTIONAL] Will just tell chrome to not go into headless mode
//[🔀]|> onlyCategories            -   [ accessibility, best-practices, performance, pwa, seo ]   <- [OPTIONAL] Array of items
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
// 📌   <=[ REQUIRED ]
// 🔀   <=[ OPTIONAL ]
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 

module.exports = {
    protocol: "https",
    host: "v-core9.com",
    path: "sitemap_index.xml",
    save_to_file: true,
    disableHeadlessMode: false,
    //onlyCategories: ["performance"]
  };
  