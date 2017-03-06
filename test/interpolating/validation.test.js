var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should not throw errors for valid paths', function(t) {
  t.plan(30)
  var paths = [
    '/'
  , '/foo'
  , '/foo/'
  , 'foo'
  , 'foo/'
  , '/foo/bar'
  , '/foo/bar/'
  , 'foo/bar'
  , 'foo/bar/'
  , '/foo(/bar)'
  , '/foo(/bar/)'
  , '/foo/(/bar/)'
  , 'foo(/bar)'
  , 'foo(/bar/)'
  , 'foo/(/bar/)'
  , '/foo(/bar(/bing))'
  , '/foo(/bar(/bing/))'
  , '/foo(/bar/(/bing/))'
  , 'foo(/bar(/bing))'
  , 'foo(/bar(/bing/))'
  , 'foo(/bar/(/bing/))'
  , '/with-dash/and_underscore'
  , '/allow%20encoded/characters'
  , '/allow space/characters'
  , '/allow/brackets()'
  , '/incomplete(/optional/part'
  , '/incomplete/{variable'
  , '/with//double/slash'
  , '/foo/{with space}'
  , '/?q=value'
  ]

  paths.forEach(function (path) {
    t.doesNotThrow(function () {
      rhumb.interpolate(path, {})
    }, 'does not throw as path is known to be valid')
  })
})

test('Interpolating should only throw errors for empty, null, undefined and missing variables', function(t) {
  t.plan(20)
  var emptyErrorRegex = /Invalid parameter: "foo" is an empty value/
    , missingErrorRegex = /Invalid parameter: "foo" is not supplied/
    , nullErrorRegex = /Invalid parameter: "foo" is null/
    , undefinedErrorRegex = /Invalid parameter: "foo" is undefined/
    , paths = [
        '/{foo}'
      , '/{foo}/wobble'
      , '/wibble/{foo}'
      , '/wibble/{foo}/{bar}/wobble'
      ]

  paths.forEach(function (path) {
    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: 'bing', bar: 'wobble' })
    }, 'does not throw as all variables are found')

    t.throws(function () {
      rhumb.interpolate(path, { foo: '', bar: 'wobble' })
    }, emptyErrorRegex
    , 'throws an error as required variable is empty')

    t.throws(function () {
      rhumb.interpolate(path, { bar: 'wobble' })
    }, missingErrorRegex
    , 'throws an error as required variable is missing')

    t.throws(function () {
      rhumb.interpolate(path, { foo: null, bar: 'wobble' })
    }, nullErrorRegex
    , 'throws an error as required variable is null')

    t.throws(function () {
      rhumb.interpolate(path, { foo: undefined, bar: 'wobble' })
    }, undefinedErrorRegex
    , 'throws an error as required variable is undefined')
  })
})

test('Interpolating should throw only errors for empty, null, undefined and missing partial variables', function(t) {
  t.plan(30)
  var emptyErrorRegex = /Invalid parameter: "foo" is an empty value/
    , missingErrorRegex = /Invalid parameter: "foo" is not supplied/
    , nullErrorRegex = /Invalid parameter: "foo" is null/
    , undefinedErrorRegex = /Invalid parameter: "foo" is undefined/
    , paths = [
        '/{foo}-end'
      , '/start-{foo}'
      , '/start-{foo}-end'
      , '/wibble/{foo}-part'
      , '/wibble/{foo}-part/wobble'
      , '/wibble/{foo}-{bar}/wobble'
      ]

  paths.forEach(function (path) {
    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: 'bing', bar: 'wobble' })
    }, 'does not throw as all variables are found')

    t.throws(function () {
      rhumb.interpolate(path, { foo: '', bar: 'wobble' })
    }, emptyErrorRegex
    , 'throws an error as required partial variable is empty')

    t.throws(function () {
      rhumb.interpolate(path, { bar: 'wobble' })
    }, missingErrorRegex
    , 'throws an error as required partial variable is missing')

    t.throws(function () {
      rhumb.interpolate(path, { foo: null, bar: 'wobble' })
    }, nullErrorRegex
    , 'throws an error as required partial variable is null')

    t.throws(function () {
      rhumb.interpolate(path, { foo: undefined, bar: 'wobble' })
    }, undefinedErrorRegex
    , 'throws an error as required partial variable is undefined')
  })
})

test('Interpolating should not throw errors when optional and nested optional parts contain an empty, null, undefined and missing variables', function(t) {
  t.plan(20)
  var paths = [
        '/wibble(/{foo})'
      , '/wibble(/{foo}/wobble)'
      , '/wibble(/{foo}/{bar})'
      , '/wibble(/{foo}(/{bar}))'
      ]

  paths.forEach(function (path) {
    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: 'bing', bar: 'wobble' })
    }, 'does not throw as all variables are found')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: '', bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when variable is empty')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when variable is missing')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: null, bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when variable is null')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: undefined, bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when variable is undefined')
  })
})

test('Interpolating should not throw errors when optional and nested optional parts contain an empty, null, undefined and missing partial variables', function(t) {
  t.plan(30)
  var paths = [
        '/wibble(/{foo}-end)'
      , '/wibble(/start-{foo})'
      , '/wibble(/start-{foo}-end)'
      , '/wibble(/{foo}-part)'
      , '/wibble(/{foo}-{bar}/wobble)'
      , '/wibble(/{foo}-{bar}/part-{bar})'
      ]

  paths.forEach(function (path) {
    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: 'bing', bar: 'wobble' })
    }, 'does not throw as all variables are found')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: '', bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when partial variable is empty')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when partial variable is missing')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: null, bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when partial variable is null')

    t.doesNotThrow(function () {
      rhumb.interpolate(path, { foo: undefined, bar: 'wobble' })
    }, 'does not throw as optional path can be dropped when partial variable is undefined')
  })
})
