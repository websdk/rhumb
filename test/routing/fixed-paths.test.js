var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Routing should handle an empty route', function (t) {
  t.plan(3)

  utils.performMatch('', '', function () {
    t.pass('empty path should match')
  })

  utils.performMatch('', '/', function () {
    t.pass('path with just a single slash should match')
  })

  utils.performMatch('', rhumb.interpolate(''), function () {
    t.pass('symmetry present when interpolated and routed')
  })
})

test('Routing should handle a path with just a single slash', function (t) {
  t.plan(3)

  utils.performMatch('/', '/', function () {
    t.pass('path with just a single slash should match')
  })

  utils.performMatch('/', '', function () {
    t.pass('empty path should match')
  })

  utils.performMatch('/', rhumb.interpolate('/'), function () {
    t.pass('symmetry present when interpolated and routed')
  })
})

test('Routing should handle a path with a single fixed part', function (t) {
  t.plan(4)

  utils.performMatch('/foo', '/foo', function () {
    t.pass('path that is identical to route should match')
  })

  utils.performMatch('/foo/', '/foo/', function () {
    t.pass('same path, but with trailing slash, should match')
  })

  utils.performMatch('/foo', rhumb.interpolate('/foo'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('/foo/', rhumb.interpolate('/foo/'), function () {
    t.pass('symmetry present when interpolated and routed')
  })
})

test('Routing should handle a path with multiple fixed part', function (t) {
  t.plan(4)

  utils.performMatch('/foo/bar/bing', '/foo/bar/bing', function () {
    t.pass('path that is identical to route should match')
  })

  utils.performMatch('/foo/bar/bing/', '/foo/bar/bing/', function () {
    t.pass('same path, but with trailing slash, should match')
  })

  utils.performMatch('/foo/bar/bing', rhumb.interpolate('/foo/bar/bing'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('/foo/bar/bing/', rhumb.interpolate('/foo/bar/bing/'), function () {
    t.pass('symmetry present when interpolated and routed')
  })
})

test('Routing should handle a path with no leading slash', function (t) {
  t.plan(8)

  utils.performMatch('foo', '/foo', function () {
    t.pass('path without leading slash should match')
  })

  utils.performMatch('foo/', '/foo/', function () {
    t.pass('same path, but with trailing slash, should match')
  })

  utils.performMatch('foo', rhumb.interpolate('/foo'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('foo/', rhumb.interpolate('/foo/'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('foo/bar/bing', '/foo/bar/bing', function () {
    t.pass('path without leading slash should match')
  })

  utils.performMatch('foo/bar/bing/', '/foo/bar/bing/', function () {
    t.pass('same path, but with trailing slash, should match')
  })

  utils.performMatch('foo/bar/bing', rhumb.interpolate('/foo/bar/bing'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('foo/bar/bing/', rhumb.interpolate('/foo/bar/bing/'), function () {
    t.pass('symmetry present when interpolated and routed')
  })
})

test('Routing should handle a path with empty parts', function (t) {
  t.plan(8)

  utils.performMatch('//', '//', function () {
    t.pass('path that is identical to route should match')
  })

  utils.performMatch('//', rhumb.interpolate('//'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('//bar/bing', '//bar/bing', function () {
    t.pass('path that is identical to route should match')
  })

  utils.performMatch('//bar/bing', rhumb.interpolate('//bar/bing'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('/foo//bing', '/foo//bing', function () {
    t.pass('path that is identical to route should match')
  })

  utils.performMatch('/foo//bing', rhumb.interpolate('/foo//bing'), function () {
    t.pass('symmetry present when interpolated and routed')
  })

  utils.performMatch('/foo/bar//', '/foo/bar//', function () {
    t.pass('path that is identical to route should match')
  })

  utils.performMatch('/foo/bar//', rhumb.interpolate('/foo/bar//'), function () {
    t.pass('symmetry present when interpolated and routed')
  })
})
