var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Routing should return false when not finding things', function(t) {
  t.plan(3)

  var router = rhumb.create()

  t.notOk(router.match('/'))
  t.notOk(router.match("/bar/foo/farr"))
  t.notOk(router.match("/bar"))
})