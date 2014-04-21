var config = require('./server-config'),
  express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  mockFileRoot = config.data_location,
  fs = require('fs');

var extendUrl = require('extend-url');
var parseUrl = require("parse-url");
var _ = require('lodash');

// CONFIG SERVER
//allows us to write cookies
app.use(express.cookieParser());

//allows server to run as proxy
app.enable('trust proxy');
app.use(express.bodyParser());
app.use(express.static(config.static_site_root));

var responseCache = {};

function getMock(path) {
  var mockResponse = responseCache[path];

  if (!mockResponse) {
    mockResponse = fs.readFileSync(path);
    mockResponse = JSON.parse(mockResponse);
    mockResponse = JSON.stringify(mockResponse).replace(/https:\/\/api\.github\.com/gi, '/api');
    responseCache[path] = mockResponse;
  }

  return mockResponse;
}

/**
 * Sends `default.json` that matches the path of the request
 * from the data dir. Assumes a rigid directory structure that
 * matches the route exactly.
 *
 * @param req
 * @param res
 */
function sendDefault(req, res) {
  var endpoint,
    splitPath = req.params[0].split('?')[0].split("/"),
    mockPath = mockFileRoot + req.params[0] + '/' + 'default.json',
    mockResponse;

  console.log(splitPath);

  if (splitPath.length > 2)
    endpoint = splitPath[splitPath.length - 2];

  console.log(endpoint, req.params[0], mockPath);

  try {
    mockResponse = getMock(mockPath);
    res.send(200, JSON.parse(mockResponse))
  } catch (err) {
    console.log(err);
    res.send(500);
  }
}

app.get(config.rest_base_url, sendDefault);
app.post(config.rest_base_url, sendDefault);

// FIRE IT UP

server.listen(config.port, function () {
  console.log("Express server listening on port %d", config.port);
});
