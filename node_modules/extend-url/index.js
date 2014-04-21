'use strict';

var qs    =  require('querystring')
  , url   =  require('url')
  , xtend =  require('xtend');

module.exports = function (url1, url2) {
  var parts1 =  url.parse(url1)
    , parts2 =  url.parse(url2)
    , qry1   =  qs.parse(parts1.query)
    , qry2   =  qs.parse(parts2.query)
    , xedQry =  xtend(qry1, qry2)

  var xedUrl = {
      protocol :  parts2.protocol
    , slashes  :  parts2.slashes
    , auth     :  parts2.auth || parts1.auth
    , host     :  parts2.host
    , hostname :  parts2.hostname
    , query    :  qs.stringify(xedQry)
    , pathname :  parts2.pathname
  };
  xedUrl.search = xedUrl.query ? '?' + xedUrl.query : ''

  return url.format(xedUrl);
};
