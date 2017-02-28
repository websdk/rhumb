function findIn(parts, tree){
  var params = {}

  var find = function(remaining, node){

    var part = remaining.shift()

    if(!part) return node.leaf || false;

    if(node.fixed && part in node.fixed){
      return find(remaining, node.fixed[part])
    }

    if(node.partial){
      var tests = node.partial.tests
        , found = tests.some(function(partial){
            if(partial.ptn.test(part)){
              var match = part.match(partial.ptn)
              partial.vars.forEach(function(d, i){
                params[d] = decode(match[i + 1])
              })
              node = partial
              return true
            }
          })

      if(found){
        return find(remaining, node)
      }
    }

    if(node["var"]){
      params[node["var"].name] = decode(part)
      return find(remaining, node["var"])
    }
    return false
  }

  var found = find(parts, tree, params)

  if(found){
    return {
      fn : found
    , params : params
    }
  }
  return false
}

function create (){
  var router = {}
    , tree   = {}

  function updateTree(parts, node, fn){
    var part = parts.shift()
      , more = !!parts.length
      , peek

    if (Array.isArray(part)) {
      node.leaf = fn
      updateTree(part, node, fn)
      return
    }

    if (!part) return

    if (part.type === "fixed") {
      node.fixed || (node.fixed = {})
      peek = node.fixed[part.input] || (node.fixed[part.input] = {})

      if (peek.leaf && !more) {
        throw new Error("Ambiguity")
      }
    } else if(part.type === "var") {
      if (node['var']) {
        if (node['var'].name === part.input) {
          peek = node['var']
        } else {
          throw new Error("Ambiguity")
        }
      } else {
        peek = node['var'] = { name : part.input }
      }
    } else if (part.type = "partial") {
      if (node.partial) {
        if (node.partial.names[part.name]) {
          throw new Error("Ambiguity")
        }
      }
      node.partial || (node.partial = { names : {}, tests : [] })

      peek = {}
      peek.ptn = part.input
      peek.vars = part.vars

      node.partial.names[part.name] = peek
      node.partial.tests.push(peek)
    }

    if (!more) {
      peek.leaf = fn
    } else {
      updateTree(parts, peek, fn)
    }
  }

  router.add = function(ptn, callback){
      updateTree(parse(ptn), tree, callback)
  }

  router.match = function(path){

    var split = path.split("?").filter(falsy)
      , pathWithoutQueryString = split[0] || ''
      , parts = ['/'].concat(pathWithoutQueryString.split("/").filter(falsy))
      , params = parseQueryString(split[1])
      , match = findIn(parts, tree)

    if(match){
      for (var prop in match.params) {
        params[prop] = match.params[prop]
      }
      return match.fn.apply(match.fn, [params])
    }
  }
  return router
}

function falsy(d){
  return !!d
}

function decode(value) {
  try {
    return decodeURIComponent(value)
  } catch (err) {
    return value
  }
}

function encode(value) {
  return encodeURIComponent(value)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/-/g, '%2D')
    .replace(/\./g, '%2E')
    .replace(/_/g, '%5F')
    .replace(/~/g, '%7E')
}

function parseQueryString(s) {
  if(!s) return {}
  return s.split("&").filter(falsy).reduce(function(qs, kv) {
    var pair = kv.split('=').filter(falsy).map(decode)
    qs[pair[0]] = pair[1]
    return qs
  }, {})
}

function parse(ptn) {
  var variable = /^{([A-Za-z0-9%]+)}$/
    , partial = /([\w!'*\-.~%]+)?{([A-Za-z0-9%]+)}([\w!'*\-.~%]+)?/
    , bracks = /^[)]+/

  return ~ptn.indexOf('(')? parseOptional(ptn) : parsePtn(ptn)

  function parseVar(part){
    var match = part.match(variable)
    return {
      type: "var"
    , input: decode(match[1])
    }
  }

  function parseFixed(part){
    return {
      type: "fixed"
    , input: part
    }
  }

  function parsePartial(part){
    var match = part.match(partial)
      , ptn = ""
      , len = part.length
      , i = 0

    while(i < len && match){
      i += match[0].length

      if(match[1]){
        ptn += match[1]
      }

      ptn += '([A-Za-z0-9%]+)'

      if(match[3]){
        ptn += match[3]
      }

      match = part.substr(i).match(partial)
    }

    var vars = []
      , name = part.replace(
      /{([A-Za-z0-9%]+)}/g
    , function(p, d){
        vars.push(decode(d))
        return "{var}"
      }
    )

    return {
      type: "partial"
    , input: new RegExp(ptn)
    , name: name
    , vars: vars
    }
  }

  function parsePtn(ptn){
    return ['/'].concat(ptn.split("/"))
      .filter(falsy)
      .map(function(d){
        if(variable.test(d)){
          return parseVar(d)
        }
        if(partial.test(d)){
          return parsePartial(d)
        }
        return parseFixed(d)
      })
  }

  function parseOptional(ptn) {
    var out =  ""
      , list = []

    var i = 0
      , len = ptn.length
      , onePart = true

    while (onePart && i < len) {
      var curr = ptn.charAt(i)
      switch(curr){
        case ")":
        case "(":
          onePart = false
          break;

        default:
          out += curr
          break;
      }
      i++
    }

    if(!onePart){
      var next = parseOptional(ptn.substr(i + 1)).slice(1)
      if(next.length){
        list.push(
          next
        )
      }
    }

    return parsePtn(out).concat(list)
  }
}

function isEmptyValue(val) {
  return val === null || val === undefined || val === ''
}

function interpolateVar(uri, part, params){
  var value = params[part.input]
  if(isEmptyValue(value)) {
    return uri
  }
  return [uri, encode(value)].join("/")
}

function interpolateFixed(uri, part){
  if(part.input === "/") {
    return uri
  }
  return [uri, part.input].join("/")
}

function interpolatePartial(uri, part, params){
  var i = 0
    , allPartialsPresent = true
    , match = part.name.replace(/\{var\}/g, function() {
        var varName = part.vars[i++]
          , value = params[varName]
        allPartialsPresent = allPartialsPresent && !isEmptyValue(value)
        return encode(value)
      })

  return allPartialsPresent ? [uri, match].join("/") : uri
}

function interpolateOptional(uri, optionalPart, params){
  return uri + optionalPart.reduce(
    function(path, part) {
      switch (part.type) {
        case "var":
          return interpolateVar(path, part, params)
        case "partial":
          return interpolatePartial(path, part, params)
        case "fixed":
          return interpolateFixed(path, part)
        default:
          return path ? interpolateOptional(path, part, params) : ''
      }
    }, '')
}

function interpolate(ptn, params) {
  var parts = ptn.split("?")

  parts[0] = parse(parts[0]).reduce(
    function(uri, part) {
      switch (part.type) {
        case "var":
          return interpolateVar(uri, part, params)
        case "partial":
          return interpolatePartial(uri, part, params)
        case "fixed":
          return interpolateFixed(uri, part)
        default:
          return interpolateOptional(uri, part, params)
      }
    }
  , ""
  ) || "/"
  return parts.filter(falsy).join("?")
}

var rhumb = create()
rhumb.create = create
rhumb.interpolate = interpolate
rhumb._parse = parse
rhumb._findInTree = findIn

module.exports = rhumb
