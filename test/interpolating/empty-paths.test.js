var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle empty paths', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/', {}), '/'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('', {}), ''
    , 'keeps path unmodified when no leading slash')
})

test('Interpolating should handle empty paths with query params', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/?q=value', {}), '/?q=value'
    , 'keeps leading slash when provided')
  t.equal(rhumb.interpolate('?q=value', {}), '?q=value'
    , 'keeps path unmodified when no leading slash')
})
