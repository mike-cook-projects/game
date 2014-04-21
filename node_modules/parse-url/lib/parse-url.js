/**
 * A url parser
 * @module parse-url
 * @author Talon Poole
 * @license MIT
 */
module.exports = function (url) {

/*
 * This module requires a valid url beginning with the http or https
 * protocol other protocols may be supported later.
 *
 * **FUTURE**:
 *
 * 1. add specific feedback on the URL structure. Why is it invalid?
 * 2. more specific/standardized/accurate URL validating Regex.
 */
  var validUrlRegex = /^http[s]?:\/\/.+\.[\w]{2,4}\/?.*$/;
  if (!validUrlRegex.test(url)) {
    throw new Error("parseUrl only works with valid URL formats. Ex. http://hello.com");
  };

/*
 * The goal is to fill this object literal all up.
 */
  var parsings =
    { protocol: null
    , baseUrl: null
    , dirs: []
    , file: null
    , fileType: null
    , fileName: null
    }

/*
 * ## protocol
 *
 * we first extract the protocol because it is the
 * first thing in all valid URLs
 *
 * So we use .match with the url and Regex
 * and take the first index.
 */
  var protocolRegex = /^http[s]?/;
  parsings.protocol = url.match(protocolRegex)[0];

/*
 * ## baseUrl
 *
 * next we obtain the baseUrl. It's going to be after the protocol and "://"
 * So we get rid of the protocol and "://"
 */
  url = url.replace(protocolRegex, "").replace(/^:\/\//, "");

/*
 * then we take the beginning of the url at this point
 * all the way up to but not including the first "/"
 * or the end of the string
 *
 */
  var baseUrlRegex = /^[A-Za-z0-9_\.-]+\.[\w]{2,4}/;
  parsings.baseUrl = url.match(baseUrlRegex)[0];

/*
 * ## file
 *
 * check the end of the string for an extension. If none then default to
 * fileName "index" fileType ".html"
 */
  url = url.replace(baseUrlRegex, "");

  var fileRegex = /[^\/]+\.\w{1,5}$/;
  if (url.match(fileRegex)) {
    parsings.file = url.match(fileRegex)[0];
  } else {
    parsings.file = "index.html";
    parsings.fileName = "index";
    parsings.fileType = ".html";
  }

/*
 * ## fileName & fileType
 *
 * if they're null then fill it in.
 * if not then they've been set above.
 */
  var fileTypeRegex = /\.\w{1,5}$/;
  if (!parsings.fileName && !parsings.fileType) {
    parsings.fileType = parsings.file.match(fileTypeRegex)[0];
    parsings.fileName = parsings.file.replace(fileTypeRegex, "");
  }

/*
 * ## dirs
 *
 * It's whatever is leftover when you remove the file.
 */
  if (!url.replace(fileRegex, "").match(/\/[^\/]+/)) {
    parsings.dirs = ["/"];
  } else {
    parsings.dirs = url.replace(fileRegex, "").match(/\/[^\/]+/g);
  }

  return parsings
};
