# Super Mixer

Mixes/merges/extends your object in multiple ways.

## Installation
```sh
$ npm i supermixer
```

## Using
Requiring.
```js
var mixer = require('supermixer'); // This is a factory.
```

NB! All functions always mutate the first argument, unless the option `clone: true` is set.

Regular mixin, aka `Object.assign`, aka `$.extend`.
```js
var extend = mixer(); // the regular Object.assign function.
extend = mixer.mixin; // same as above.

extend({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
```

Mixin functions only.
```js
var functionMixer = mixer({ // assigns own functions only
  filter: function (val) { return typeof val === 'function' ; }
});
functionMixer = module.exports.mixinFunctions; // same as above

functionMixer({}, { a: "x" },  { b: function(){} }); // { b() }
```

Mixin functions including prototype chain.
```js
var chainFunctionMixer = mixer({ // assigns functions only, but traverse through the protorype chain
  filter: function (val) { return typeof val === 'function' ; },
  chain: true
});
chainFunctionMixer = mixer.mixinChainFunctions; // same as above

chainFunctionMixer({}, new EventEmitter()); // { on(), off(), emit(), ... }
```

Deep merge data of any number of objects to a new object.
```js
var mergeDeep = mixer({ // deep merge own properties.
  filter: function (val) { return typeof val !== 'function'; },
  deep: true
});
mergeDeep = mixer.merge; // same as above

mergeDeep({ url: { host: "example.com" } }, { url: { port: 81 } }); // { url: { host: "example.com", port: 81 } }
```

Deep merge non functions to a new object, including prototype chain.
```js
var mergeChainData =  mixer({ // deeply merges data properties, traversing through prototype chain
  filter: function (val) { return typeof val !== 'function'; },
  chain: true
});
mergeChainData = mixer.mergeChainNonFunctions; //same as above

EventEmitter.prototype.hello = "world";
mergeChainData(new EventEmitter()); // { hello: "world" }
```

# TODO
* Tests
* Travis
* More `mixer.FUNCTION` functions

# Want to contribute?
It is Open Open Source. Whoever sends a PR, which gets accepted, receives the write permissions.
