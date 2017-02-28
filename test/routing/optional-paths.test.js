var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Routing should handle a path with an empty fixed part', function (t) {
  t.plan(2)

  utils.performMatch('(/foo)', '/foo', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('(/foo)', '/', function () {
    t.pass('empty path should also match')
  })
})

test('Routing should handle a path with fixed part and optional part', function (t) {
  t.plan(4)

  utils.performMatch('/wibble(/foo)', '/wibble/foo', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/foo)', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })

  utils.performMatch('/wibble(/foo/bar)', '/wibble/foo/bar', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/foo/bar)', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })

  utils.performMatch('/wibble(/foo/bar)', '/wibble/foo', function () {
    t.fail('path without all of optional part should not match')
  })
})

test('Routing should handle a path with empty optional part', function (t) {
  t.plan(1)

  utils.performMatch('/wibble()', '/wibble', function () {
    t.pass('path without empty optional part should match')
  })
})

test('Routing should handle a path with trailing slash in fixed path and leading slash in the optional path', function (t) {
  t.plan(2)

  utils.performMatch('/wibble/(/foo)', '/wibble/foo', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble/(/foo)', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })
})

test('Routing should handle a path with empty parts', function (t) {
  t.plan(6)

  utils.performMatch('/wibble(//bar/bing)', '/wibble/bar/bing', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(//bar/bing)', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })

  utils.performMatch('/wibble(/foo//bing)', '/wibble/foo/bing', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/foo//bing)', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })

  utils.performMatch('/wibble(/foo/bar//)', '/wibble/foo/bar', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/foo/bar//)', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })
})

test('Routing should handle a path with fixed part and single variable optional part', function (t) {
  t.plan(2)

  utils.performMatch('/wibble(/{foo})', '/wibble/bing', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/{foo})', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })
})

test('Routing should handle a path with fixed part and multiple variable optional parts', function (t) {
  t.plan(2)

  utils.performMatch('/wibble(/{foo}/{bar})', '/wibble/bing/wobble', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/{foo}/{bar})', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })

  utils.performMatch('/wibble(/{foo}/{bar})', '/wibble/bing', function () {
    t.fail('path without all of optional part should not match')
  })
})

test('Routing should handle a path with fixed part and single partial optional part', function (t) {
  t.plan(2)

  utils.performMatch('/wibble(/{foo}-{bar})', '/wibble/bing-wobble', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/{foo}-{bar})', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })
})

test('Routing should handle a path with fixed part and multiple partial optional parts', function (t) {
  t.plan(2)

  utils.performMatch('/wibble(/{foo}-part/part-{bar})', '/wibble/bing-part/part-wobble', function () {
    t.pass('path with optional part should match')
  })

  utils.performMatch('/wibble(/{foo}-part/part-{bar})', '/wibble', function () {
    t.pass('path without the optional parts should match')
  })

  utils.performMatch('/wibble(/{foo}-part/part-{bar})', '/wibble/bing-part', function () {
    t.fail('path without all of optional part should not match')
  })

  utils.performMatch('/wibble(/{foo}-part/part-{bar})', '/wibble/-part/part-wobble', function () {
    t.fail('path without all of partial variables should not match')
  })
})
