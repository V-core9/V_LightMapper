//?  Sitemap Lighthouse Scanner Settings
//?  This is the file we need to set for the sitemap - scanner to work properly.
// 
//!  - -[ <root> / sitemap-scanner.config.js ] - - - - - - - - - - - - - - - - - - - -
//*  module.exports = {
//*    protocol: "https",
//*    host: "v-core9.com",
//*    path: "sitemap_index.xml"
//*  };
//!  - - - - - - - - - - - - - - - - - - - - - - <[ EOF ]>- - - - - - - - - 
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
//? Options Info: 
//   |> protocol  - "http" || "https"                                     <- Just a protocol to use when referring to 
//   |> host      -    "localhost:8080" || "random-host"        <- Domain / Host .... adding port if local 
//   |> path     -    "sitemap_index.xml"                              <- Relative location of the sitemap file 
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 



module.exports = {
  protocol: "https",
  host: "v-core9.com",
  path: "sitemap_index.xml"
};
