var extendUrl = require('..');

var url1 = 'https://joe:schmoe@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  , url2 = 'https://api.github.com/users/thlorenz/repos?page=1&per_page=10'
  , extended = extendUrl(url1, url2);

console.log(extended)
