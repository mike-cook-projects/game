# extend-url [![build status](https://secure.travis-ci.org/thlorenz/extend-url.png)](http://travis-ci.org/thlorenz/extend-url)

[![testling badge](https://ci.testling.com/thlorenz/extend-url.png)](https://ci.testling.com/thlorenz/extend-url)

Splits a url into its parts and adds or replaces items found in the parts of another url.

```js
var extendUrl = require('extend-url');

var url1 = 'https://joe:schmoe@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  , url2 = 'https://api.github.com/users/thlorenz/repos?page=1&per_page=10'
  , extended = extendUrl(url1, url2);

console.log(extended)
```

```
https://joe:schmoe@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2&page=1&per_page=10
```

## Installation
    
    npm install extend-url

## API

### ***extendUrl(url1 : String, url2 : String) : String***

Returns a url that extends url1 with url2 as follows:

- **protocol** from url2
- **auth** from url2 or url1 whichever is found first
- **pathname** from url2
- **host** from url2
- **search** (query) url1's query extended with url2's query
