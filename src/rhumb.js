function findIn(parts, tree) {
  var params = {}

  var find = function (remaining, node) {
    var part = remaining.shift()

    if (!part) {
      return node.leaf || false
    }

    if (node.fixed && part in node.fixed) {
      return find(remaining, node.fixed[part])
    }

    if (node.partial) {
      var tests = node.partial.tests
        , found = tests.map(function (partial) {
          var params = partial.matchFunction(part)
            return params ? { partial: partial, params: params } : null
          }).filter(falsy)
        , matchingPartial = found.length > 0 ? found[0] : null

      if (matchingPartial) {
        for (var key in matchingPartial.params) {
          params[key] = matchingPartial.params[key]
        }
        return find(remaining, matchingPartial.partial)
      }
    }

    if (node.variable) {
      params[node.variable.identifier] = part
      return find(remaining, node.variable)
    }
    return false
  }

  var found = find(parts, tree, params)

  if (found) {
    return {
      fn : found
    , params : params
    }
  }
  return false
}

function create() {
  var router = {}
    , tree = {}

  function updateTree(part, node, fn) {
    var segment = part.segments.shift()
      , more = !!part.segments.length
      , peek

    if (!segment) {
      if (node.leaf) {
        throw new Error('Ambiguity')
      }

      node.leaf = fn
      return
    }

    if (Array.isArray(segment.segments)) {
      if (node.leaf) {
        throw new Error('Ambiguity')
      }
      node.leaf = fn
      updateTree(segment, node, fn)
      return
    }

    switch (segment.type) {
      case 'fixed':
        if (!node.fixed) {
          node.fixed = {}
        }
        if (!node.fixed[segment.identifier]) {
          node.fixed[segment.identifier] = {}
        }
        peek = node.fixed[segment.identifier]

        if (peek.leaf && !more) {
          throw new Error('Ambiguity')
        }
        break
      case 'var':
        if (node.variable) {
          if (node.variable.identifier === segment.identifier) {
            peek = node.variable
          } else {
            throw new Error('Ambiguity')
          }
        } else {
          node.variable = { identifier: segment.identifier }
          peek = node.variable
        }
        break
      case 'partial':
        if (node.partial) {
          if (node.partial.identifiers[segment.identifier]) {
            throw new Error('Ambiguity')
          }
        } else {
          node.partial = { identifiers: {}, tests: [] }
        }

        peek = { matchFunction: segment.matchFunction }

        node.partial.identifiers[segment.identifier] = peek
        node.partial.tests.push(peek)
        break
      case 'empty':
        throw new Error('Ambiguity')
    }
    if (!more) {
      peek.leaf = fn
    } else {
      updateTree(part, peek, fn)
    }
  }

  router.add = function (ptn, callback) {
      updateTree(parse(ptn), tree, callback)
  }

  router.match = function(path){
    var split = path.split("?").filter(falsy)
      , parts = split[0].split('/').filter(falsy)
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

function parseQueryString(s) {
  if(!s) return {}
  return s.split("&").filter(falsy).reduce(function(qs, kv) {
    var pair = kv.split('=').filter(falsy)
    qs[pair[0]] = pair[1]
    return qs
  }, {})
}

function asEmptySegment(pathSegment) {
  return pathSegment === '' ? { type: 'empty' } : null
}

function asFixedSegment(pathSegment) {
  return { type: 'fixed', identifier: pathSegment }
}

function asPartialSegment(pathSegment) {
  var partialRegex = /([\w'-]+)?{([\w-]+)}([\w'-]+)?/
    , match = pathSegment.match(partialRegex)
    , vars = []
    , ptn = ''
    , len = pathSegment.length
    , index = 0
    , identifier = pathSegment.replace(/{([\w-]+)}/g, extractAndTransformVariableName)

  if (!match) {
    return null
  }

  while(index < len && match) {
    index += match[0].length

    if (match[1]) {
      ptn += match[1]
    }

    ptn += '([\\w-]+)'

    if (match[3]) {
      ptn += match[3]
    }

    match = pathSegment.substr(index).match(partialRegex)
  }

  var matchRegex = new RegExp(ptn)

  return {
    type: 'partial'
  , identifier: identifier
  , matchFunction: matchFunction
  , vars: vars
  }

  function extractAndTransformVariableName(matchedPattern, variableName) {
    vars.push(variableName)
    return '{var}'
  }

  function matchFunction(segment) {
    var segmentMatches = segment.match(matchRegex)

    return segmentMatches ? vars.reduce(function (params, variable, index) {
      params[variable] = segmentMatches[index + 1]
      return params
    }, {}) : null
  }
}

function asVarSegment(pathSegment) {
  var match = pathSegment.match(/^{(\w+)}$/)

  return match ? { type: 'var', identifier: match[1] } : null
}

function parsePtn(ptn) {
  return ptn.split('/')
    .reduce(function(parsedRecord, pathSegment, index, allSegments) {
      if (pathSegment === '' && index === 0) {
        parsedRecord.leadingSlash = allSegments.length > 1
      } else if (pathSegment === '' && index === allSegments.length - 1) {
        parsedRecord.trailingSlash = true
      } else {
        var newSegment = asEmptySegment(pathSegment)
              || asVarSegment(pathSegment)
              || asPartialSegment(pathSegment)
              || asFixedSegment(pathSegment)
        parsedRecord.segments.push(newSegment)
      }
      return parsedRecord
    }, { leadingSlash: false, segments: [], trailingSlash: false })
}

function parseOptional(ptn) {
  var out =  ''

  var i = 0
    , len = ptn.length
    , isOptionalSegment = false

  while (!isOptionalSegment && i < len) {
    var curr = ptn.charAt(i)
    switch (curr) {
      case ')':
      case '(':
        isOptionalSegment = true
        break
      default:
        out += curr
        break
    }
    i++
  }

  var parsedOutput = parsePtn(out)
  if (isOptionalSegment) {
    var optionalSegment = parseOptional(ptn.substr(i))
    if (optionalSegment.segments.length > 0) {
      parsedOutput.segments.push(optionalSegment)
    }
  }

  return parsedOutput
}

function parse(ptn){
  return ptn.indexOf('(/') > -1 ? parseOptional(ptn) : parsePtn(ptn)
}

var rhumb = create()
rhumb.create = create
rhumb._parse = parse
rhumb._findInTree = findIn

module.exports = rhumb
