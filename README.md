# dull-config
Configuration should be dull. Less abracadabra.

node.js 4x and up. Not sure about browsers

## Philosophy
Just use plain javascript files for configuration. This allows for comments and computed configurations. You can break up the configuration into as many files as you like. They can be where ever you like.

Keep configs for different environments in the same file. I find this is easier than swiching back and forth between production.config.js and development.config.js

Keep the loading approach simple. No globbing for files. Just load require()'d config modules.

Throw errors when requested configs are missing or undefined. This helps protect from typos, and from computed settings that might return undefined.

But mostly it's just javascript, and not even that much.  90 lines of code with docs :-)  Not including dependancies.

### Installation

not live on npm yet. but when it is.
```
$ npm install dullconfig
```

### Usage

```js
const config = require('config')

// you can load an object
config.load({
    email : {
        defaultTo : 'to@test.com',
        defaultFrom : 'from@test.com'
    }
})

//now you can get the default to address for email like
let to = config.get('email.defaultTo') // = to@test.com

//you can load more,
config.load({
    api : {
        url : 'some.place.com',
        version : 1 
    }
})

// now both email, and db are available
let to = config.get('email.defaultFrom') // => 'from@test.com'
let url = config.get('api.url') // => 'some.place.com'

//also, you can retrieve objects
let apiConfig = config.get('api') // => {url : 'some.place.com', version 1}

// if you enter a string that doesn't match a setting, it'll throw.
apiConfig = config.get('some.typo') // => ConfigError

// if you want to see if a config is there, or not with out throwing, 
//use has()
apiConfig = config.has('some.typo') //=> false


// you can also load straight from files, using require.
// provided those files export your config object
// here we load from a config directory
config.load({
    db : require ('./config/db.js'),
    stripe : require('./config/stripe.js')
})

```

### Handling Deployment Environment Config differences


```js
// this object will load the same in all environments
{
    api : 'some.endpoint.com',
    customerPath : '/customer'
}

// however this one contains on override for one of the settings
{
    default : {
        api : 'some.endpoint.com',
        customerPath : '/customer'
    },
    production : {
        api : 'production.endpoint.com'  // overrides the default
    }
}

// when this file is loaded with NODE_ENV set to production
// it will get merged into this

{
    api : 'production.endpoint.com'
    customerPath : '/customer'
}

// NOTE: if you want to include env settings like "production", "development",
//etc, you'll need to start with a "default" like the example, and override 
//the other settings.

```

### Secrets

Don't put secret things in directly in the config. Its bad. Instead use Environmental variables, and then bring them into the config using `process.env.SECRET` like this


_config/db.js_
```js
module.export = {
    userName : process.env.DB_USER_NAME,
    password : process.env.DB_PASSWORD,
}
```

_index.js_
```js
const config = require('config')
config.load({
       'db': require('./config/db.js'
   })

// now you can get the configs like
let user = config.get('db.userName')

// if DB_USER_NAME was set in the environment, then you'll get it.
user==='admin' // => true if DB_USER_NAME = 'admin'

// if it wasn't set, then it'll be undefined, and it'll throw.
// ConfigError

```

