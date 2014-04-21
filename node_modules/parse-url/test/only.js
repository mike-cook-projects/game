var should = require("chai").should()
  , parseUrl = require("..");

describe("parseUrl.js", function() {

  it("should handle a very basic URL", function () {
    test =
      { url: "http://theghostin.me/"
      , expected:
          { protocol: "http"
          , baseUrl: "theghostin.me"
          , dirs: ["/"]
          , file: "index.html"
          , fileType: ".html"
          , fileName: "index"
          }
      };

    parseUrl(test.url).should.deep.equal(test.expected);
  });

  it("should handle a basic url file structure", function () {
    test =
      { url: "https://theghostin.me/audio.mp3"
      , expected:
          { protocol: "https"
          , baseUrl: "theghostin.me"
          , dirs: ["/"]
          , file: "audio.mp3"
          , fileType: ".mp3"
          , fileName: "audio"
          }
      };

    parseUrl(test.url).should.deep.equal(test.expected);
  });

  it("should handle deep paths", function () {
    test =
      { url: "http://theghostin.me/deep/deeper/deepest/audio.mp3"
      , expected:
          { protocol: "http"
          , baseUrl: "theghostin.me"
          , dirs: ["/deep", "/deeper", "/deepest"]
          , file: "audio.mp3"
          , fileType: ".mp3"
          , fileName: "audio"
          }
      };

    parseUrl(test.url).should.deep.equal(test.expected);
  });

  it("should not handle invalid URL formats", function () {
    parseUrl("fuckthepolice").should.throw(Error);
  });

});


