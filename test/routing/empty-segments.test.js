var test = require('tape')
  , rhumb = require('../../src/rhumb')
  , emptySegmentRouteError = /Invalid route: Must not contain an empty segment/

test('Routing should throw an error for adding routes with empty segments', function (t) {
  t.plan(4)
  var router = rhumb.create()

  t.throws(function () {
    router.add('//', function () {})
  }, emptySegmentRouteError)

  t.throws(function () {
    router.add('//bar/bing', function () {})
  }, emptySegmentRouteError)

  t.throws(function () {
    router.add('/foo//bing', function () {})
  }, emptySegmentRouteError)

  t.throws(function () {
    router.add('/foo/bar//', function () {})
  }, emptySegmentRouteError)
})
