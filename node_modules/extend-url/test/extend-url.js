'use strict';
/*jshint asi: true */

var test = require('tape')
var extend = require('..')


test('extends urls', function (t) {
  function check(url1, url2, extended) {
    t.equal(
        extend(url1, url2)
      , extended
      , 'extends correctly')
    console.error('\n[' + url1 + '\n ' + url2 + '\n ' + extended + ']')
  }

  check(
    'https://joe:schmoe@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  , 'https://api.github.com/users/thlorenz/repos?page=1&per_page=10'
  , 'https://joe:schmoe@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2&page=1&per_page=10'
  )

  check(
    'https://joe:schmoe@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  , 'https://beep:boop@api.github.com/users/thlorenz/repos'
  , 'https://beep:boop@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  )

  check(
    'https://api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  , 'https://beep:boop@api.github.com/users/thlorenz/repos'
  , 'https://beep:boop@api.github.com/users/thlorenz/repos?client_id=1&client_secret=2'
  )

  check(
    'https://api.github.com/users/thlorenz/repos'
  , 'https://other.url.com/users/thlorenz/repos'
  , 'https://other.url.com/users/thlorenz/repos'
  )

  check(
    'https://api.github.com/users/thlorenz/repos?hello=world'
  , 'https://other.url.com/users/thlorenz/repos'
  , 'https://other.url.com/users/thlorenz/repos?hello=world'
  )

  t.end() 
})
