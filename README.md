[![Build Status](https://travis-ci.org/koresar/supermixer.svg?branch=master)](https://travis-ci.org/koresar/supermixer)
# Super Mixer

Mixes/merges/extends your object in multiple ways.

## Install
```sh
$ npm install supermixer
```

## Getting started

```js
var mixer = require('supermixer');
```

_**NB! All functions always mutate the first argument.**_

### Regular mixin, aka `Object.assign`, aka `$.extend`.
```js
 // the regular Object.assign function
var extend = mixer();
// OR
extend = mixer.mixin;

extend({}, { a: 1 }, { b: 2 });
// { a: 1, b: 2 }
```

### Mixin functions only.
```js
// assigns own functions only
var functionMixer = mixer({
  filter: function (val) { return typeof val === 'function' ; }
});
// OR
functionMixer = mixer.mixinFunctions;

functionMixer({}, { a: "x" },  { b: function(){} });
// { b() }
```

### Mixin functions including prototype chain.
```js
// assigns functions only, but traverse through the protorype chain
var chainFunctionMixer = mixer({
  filter: function (val) { return typeof val === 'function' ; },
  chain: true
});
// OR
chainFunctionMixer = mixer.mixinChainFunctions;

chainFunctionMixer({}, new EventEmitter());
// { on(), off(), emit(), ... }
```

### Deep merge data of any number of objects to a new object.
```js
// deep merge own properties
var mergeDeep = mixer({
  filter: function (val) { return typeof val !== 'function'; },
  deep: true
});
// OR
mergeDeep = mixer.merge;

mergeDeep({ url: { host: "example.com" } }, { url: { port: 81 } });
// { url: { host: "example.com", port: 81 } }
```

### Deep merge non functions to a new object, including prototype chain.
```js
// deeply merges data properties, traversing through prototype chain
var mergeChainData =  mixer({
  filter: function (val) { return typeof val !== 'function'; },
  deep: true,
  chain: true
});
// OR
mergeChainData = mixer.mergeChainNonFunctions;

EventEmitter.prototype.hello = "world";
mergeChainData(new EventEmitter());
// { hello: "world" }
```

## TODO
* Tests
* Travis
* More `mixer.FUNCTION` functions

## Want to contribute?
This project is Open Open Source. This means whoever submits an accepted PR will receive write permissions to the project.
