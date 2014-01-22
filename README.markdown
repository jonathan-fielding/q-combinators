# node-q-combinators

functions to combine (q) promises. 


## Installing

Add the following to your package.json dependencies: 

```json
{
	"dependencies": { 
		"q-combinators": "git+ssh://git@github.com:zeebox/node-q-combinators.git#v0.0.1"
	}
}	
```

## API

### .object.all

Resolves an object of promises with an object of the resultant values if all promises resolve.  If any promise rejects, it rejects with the same reason

```javascript
	
	// happy path
	qCombinators.object.all({
		x: Q('foo'),
		y: Q('bar'),
		z: Q('quux')
	})
	.then(function(object){
		// object is:
		// { 
		//   x: 'foo',
		//   y: 'bar',
		//   z: 'quux'
		// }
	});

	// sad path
	qCombinators.object.all({ 
		x: Q.reject('foo'),
		y: Q(),
		z: Q()
	})
	.then(null, function(err){ 
		// err is 'foo' 
	});

```


### .object.allSettled

Resolves an object of promises with *all* results, using the same format as Q.allSettled

```javascript
	qCombinators.object.allSettled({ 
		x: Q.reject('foo'),
		y: Q('bar'),
		z: Q('quux')
	})
	.then(function(object){ 
		// object is: 
		// { 
		//	  x: { state: 'rejected', reason: 'foo' },
		//	  y: { state: 'fulfilled', value: 'bar' },
		//	  z: { state: 'fulfilled', value: 'quux' }
		// }
	})
```

### .object.fulfilled

Resolves an object of promises with *only* the successes.  If none of the promises succeed, it succeeds with an empty object. 

```javascript
	qCombinators.object.allSettled({ 
		x: Q.reject('foo'),
		y: Q('bar'),
		z: Q('quux')
	})
	.then(function(object){ 
		// object is:
		// {
		//   y: 'bar',
		//   z: 'quux'
		// }
	})
```


## Contributing

Pull request to this repo, and get a code-review :D.
