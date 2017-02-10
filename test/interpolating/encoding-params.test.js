var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should encode the variable parts', function(t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/{package}', { package: '@abc/de' }), '/%40abc%2Fde', 'correctly encodes @abc/de')
  t.equal(rhumb.interpolate('/{booktitle}/author', { booktitle: 'Where\'s Waldo?' }), '/Where\'s%20Waldo%3F/author', 'correctly encodes Where\'s Waldo?')
})

test('Interpolating should encode the partial parts', function(t) {
t.plan(1)

t.equal(rhumb.interpolate('/{day}-{month}-{year}', { day: '??', month: 'jan & may', year: '2020' }), '/%3F%3F-jan%20%26%20may-2020', 'correctly encodes partial parts')
})
