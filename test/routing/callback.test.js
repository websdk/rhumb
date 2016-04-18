var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test("Routing should trigger callback and get return value", function(t) {
  t.plan(3)

  var router = rhumb.create()

  router.add('/', function() {
    return 'slash triggered'
  })

  router.add("/bar", function(){
    return "woo, bar triggered"
  })

  router.add("/bar/foo/farr", function(){
    return "bar/foo/farr triggered"
  })

  t.equal(router.match('/'), 'slash triggered')
  t.equal(router.match("/bar/foo/farr"), "bar/foo/farr triggered")
  t.equal(router.match("/bar"), "woo, bar triggered")
})

test("Routing should pass params object to callback", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/sing/{sound}", function(params){
    return params
  })

  t.deepEqual(router.match("/sing/bird-song"), { sound: "bird-song" })
})