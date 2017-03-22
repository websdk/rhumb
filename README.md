Rhumb
=====

Rhumb is a highly efficient and flexible router.

Given a URI – where the constituent parts may be fixed or variable – Rhumb will unambiguously and with negligable overhead find a matching function, then apply it with whatever parameters might have been extracted from the URI.

[Read more](RATIONALE.md).


Bells and Whistles
------------------
* automatic path precedence
* ambiguity detection
* variables parts
* partially variable parts
* optional parts
* parameter parsing
* interpolate params to produce paths


Basic Usage
-----------

Rhumb allows you to map paths to functions

```javascript
rhumb.add("/happy/shoes", function(){
  return shoes
})
```

If those paths contain variable parts, rhumb will grab them for you

```javascript
rhumb.add("/happy/shoes/{color}", function(params){
  return shoes.inColor(params.color)
})
```

Whatever you return in the callback will to handed back to the caller of `match`

```javascript
redShoes = rhumb.match("/happy/shoes/red")
```

When you need to create a URI from a set of params, the `interpolate` function can be used

```javascript
redShoesUri = rhumb.interpolate("/happy/shoes/{color}", { color: "red" })
```

Route Syntax
------------

#### fixed paths

Fixed paths are the most simple

```javascript
rhumb.add("/latest/potatoes")
```

will match `/latest/potatoes` *only*

#### variable parts

Use variable parts in your path to allow a range of options

```javascript
rhumb.add("/potatoes/{variety}")
```

This route will match when anything is provided as a _variety_ e.g.

* /potatoes/osprey
* /potatoes/saxon
* /potatoes/marabel
* /potatoes/321
* /potatoes/chips

A variety *must* be provided, so `/potatoes` alone will not match

Paths with variable parts generate a `params` object which is passed to the callback

```javascript
rhumb.add("/potatoes/{variety}", function(params){
  console.log(params.variety)
})
rhumb.match("/potatoes/marabel")
// > "marabel"
```

#### partially variable parts

Partially variable parts allow you to capture more than one variable from a single segment of a URL.

If you wanted to capture a date in a url like `/news-from/tue-march-1900` you could do so using partial parts.

```javascript
rhumb.add("/news-from/{day}-{month}-{year}", function(params){
  console.log(
    params.day
  , params.month
  , params.year
  )
})
```

#### optional parts

Optional parts, well, are optional

```javascript
rhumb.add("/stories(/{name})")
```
The above route matches for `/stories` and for `/stories/anything`

Optionals can be nested e.g.

```javascript
rhumb.add("/stories(/{author}(/{genre}))")
```
Will match

* `/stories`
* `/stories/bob`
* `/stories/sarah/scary`

Have fun!

Parameter Interpolation
-----------------------

Rhumb allows you to take a route and a set of params and produce a path that can be matched against a route.

#### fixed paths

When you give `.interpolate(...)` a route without any declared variables or partial variable parts, then you will not see much changes:

```javascript
rhumb.interpolate("/stories", {})
// returns "/stories"

rhumb.interpolate("/stories?sortBy=publishedDate", {})
// returns "/stories?sortBy=publishedDate"
```


#### variable parts

When variables are present, Rhumb is will interpolate the variables with the params you supply:

```javascript
rhumb.interpolate("/potatoes/{variety}", { variety: "marabel" })
// returns "/potatoes/marabel"

rhumb.interpolate("/shoes/{color}/{size}", { color: "red", size: "6" })
// returns "/shoes/red/6"
```

For interpolation to produce a valid path, it will throw and error when a required variable is absent, `""`, `null` or `undefined`:

```javascript
rhumb.interpolate("/potatoes/{variety}", {})
// throws 'Invalid parameter: "variety" is missing'

rhumb.interpolate("/shoes/{color}/{size}", { color: "red", size: null })
// throws 'Invalid parameter: "size" is null'
```

To mark a variable part as not-required, it has to be wrapped in an optional path, as shown later.

#### partially variable parts

Like variables, Rhumb will interpolate partially variable parts when they are defined and not empty in the supplied params:

```javascript
rhumb.interpolate("/orders/{days}-days-ago", { days: "40" })
// returns "/orders/40-days-ago"

rhumb.interpolate("/author/{forename}-{surname}", { forename: "susan", surname: "smith" })
// returns "/author/susan-smith"
```

It will also throw and error when a required partial variable is absent, `""`, `null` or `undefined`:

```javascript
rhumb.interpolate("/orders/{days}-days-ago", { days: "" })
// throws 'Invalid parameter: "days" is empty'

rhumb.interpolate("/author/{forename}-{surname}", { forename: "susan", surname: undefined })
// throws 'Invalid parameter: "surname" is undefined'
```

To mark a partially variable part as not-required, it has to be wrapped in an optional path, as shown later.

#### optional parts

Rhumb has is greedy with how it handles optional paths when interpolating, so expect optional parts to be included whenever possible.

```javascript
rhumb.interpolate("/stories(/bob)", {})
// returns "/stories/bob"

rhumb.interpolate("/stories(/sarah(/scary))", {})
// returns "/stories/sarah/scary"
```

When variables or partially variables in optional parts are absent, `""`, `null` or `undefined` then no error is thown and the optional part is dropped.

```javascript
rhumb.interpolate("/stories(/by-{name})", {})
// returns "/stories"

rhumb.interpolate("/stories(/{author}(/{genre}))", { author: "sarah", genre: "" })
// returns "/stories/sarah"
```

Found an issue, or want to contribute?
--------------------------------------

If you find an issue, want to start a discussion on something related to this project, or have suggestions on how to improve it? Please [create an issue](../../issues/new)!

See an error and want to fix it? Want to add a file or otherwise make some changes? All contributions are welcome! Please refer to the [contribution guidelines](CONTRIBUTING.md) for more information.

License
-------

Please refer to the [license](LICENSE.md) for more information on licensing and copyright information.
