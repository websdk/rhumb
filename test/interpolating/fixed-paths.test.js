var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle single segment fixed paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/foo', {}), '/foo'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('foo', {}), 'foo'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/foo/', {}), '/foo/'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('foo/', {}), 'foo/'
    , 'keeps trailing slash when provided')
})

test('Interpolating should handle multi-segment fixed paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/foo/bar/bing', {}), '/foo/bar/bing'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('foo/bar/bing', {}), 'foo/bar/bing'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/foo/bar/bing/', {}), '/foo/bar/bing/'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('foo/bar/bing/', {}), 'foo/bar/bing/'
    , 'keeps trailing slash when provided')
})

test('Interpolating should handle single segment fixed optional paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/foo)', {}), '/wibble/foo'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo)', {}), 'wibble/foo'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/foo/)', {}), '/wibble/foo/'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo/)', {}), 'wibble/foo/'
    , 'keeps trailing slash when provided')
})

test('Interpolating should handle multi-segment fixed optional paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/foo/bar)', {}), '/wibble/foo/bar'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo/bar)', {}), 'wibble/foo/bar'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/foo/bar/)', {}), '/wibble/foo/bar/'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo/bar/)', {}), 'wibble/foo/bar/'
    , 'keeps trailing slash when provided')
})

test('Interpolating should handle fixed nested optional paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/foo(/bar))', {}), '/wibble/foo/bar'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo(/bar))', {}), 'wibble/foo/bar'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/foo(/bar/))', {}), '/wibble/foo/bar/'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo(/bar/))', {}), 'wibble/foo/bar/'
    , 'keeps trailing slash when provided')
})

test('Interpolating should handle slashes before the optional paths', function (t) {
  t.plan(8)

  t.equal(rhumb.interpolate('/wibble/(/foo)', {}), '/wibble/foo'
    , 'prevent double slashes from occuring')
  t.equal(rhumb.interpolate('wibble/(/foo)', {}), 'wibble/foo'
    , 'prevent double slashes from occuring')
  t.equal(rhumb.interpolate('/wibble/(/foo/)', {}), '/wibble/foo/'
    , 'prevent double slashes from occuring')
  t.equal(rhumb.interpolate('wibble/(/foo/)', {}), 'wibble/foo/'
    , 'prevent double slashes from occuring')

  t.equal(rhumb.interpolate('/wibble(/foo/(/bar))', {}), '/wibble/foo/bar'
    , 'prevent double slashes from occuring')
  t.equal(rhumb.interpolate('wibble(/foo/(/bar))', {}), 'wibble/foo/bar'
    , 'prevent double slashes from occuring')
  t.equal(rhumb.interpolate('/wibble(/foo/(/bar/))', {}), '/wibble/foo/bar/'
    , 'prevent double slashes from occuring')
  t.equal(rhumb.interpolate('wibble(/foo/(/bar/))', {}), 'wibble/foo/bar/'
    , 'prevent double slashes from occuring')
})

test('Interpolating should handle empty segments in fixed paths', function (t) {
  t.plan(8)

  t.equal(rhumb.interpolate('//', {}), '/%2F'
    , 'handles just an empty segment')
  t.equal(rhumb.interpolate('//bar/bing', {}), '/%2Fbar/bing'
    , 'handles a leading empty segment')
  t.equal(rhumb.interpolate('/foo//', {}), '/foo%2F/'
    , 'handles a trailing empty segment')
  t.equal(rhumb.interpolate('foo//bing', {}), 'foo%2F/bing'
    , 'handles an empty segment in the middle')

  t.equal(rhumb.interpolate('///', {}), '/%2F%2F'
    , 'handles just an empty segment')
  t.equal(rhumb.interpolate('///bar/bing', {}), '/%2F%2Fbar/bing'
    , 'handles a leading empty segment')
  t.equal(rhumb.interpolate('/foo///', {}), '/foo%2F%2F/'
    , 'handles a trailing empty segment')
  t.equal(rhumb.interpolate('foo///bing', {}), 'foo%2F%2F/bing'
    , 'handles an empty segment in the middle')
})

test('Interpolating should handle fixed paths with query params', function (t) {
  t.plan(8)

  t.equal(rhumb.interpolate('/foo?q=value', {}), '/foo?q=value'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('foo?q=value', {}), 'foo?q=value'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/foo/?q=value', {}), '/foo/?q=value'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('foo/?q=value', {}), 'foo/?q=value'
    , 'keeps trailing slash when provided')

  t.equal(rhumb.interpolate('/foo/bar/bing?q=value', {}), '/foo/bar/bing?q=value'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('foo/bar/bing?q=value', {}), 'foo/bar/bing?q=value'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/foo/bar/bing/?q=value', {}), '/foo/bar/bing/?q=value'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('foo/bar/bing/?q=value', {}), 'foo/bar/bing/?q=value'
    , 'keeps trailing slash when provided')
})

test('Interpolating should handle fixed optional paths with query params', function (t) {
  t.plan(8)

  t.equal(rhumb.interpolate('/wibble(/foo)?q=value', {}), '/wibble/foo?q=value'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo)?q=value', {}), 'wibble/foo?q=value'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/foo/)?q=value', {}), '/wibble/foo/?q=value'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo/)?q=value', {}), 'wibble/foo/?q=value'
    , 'keeps trailing slash when provided')

  t.equal(rhumb.interpolate('/wibble(/foo/bar)?q=value', {}), '/wibble/foo/bar?q=value'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo/bar)?q=value', {}), 'wibble/foo/bar?q=value'
    , 'keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/foo/bar/)?q=value', {}), '/wibble/foo/bar/?q=value'
    , 'keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/foo/bar/)?q=value', {}), 'wibble/foo/bar/?q=value'
    , 'keeps trailing slash when provided')
})
