[![API Doc](https://doclets.io/toddgeist/dull-config/master.svg)](https://doclets.io/toddgeist/dull-config/master)
# dull-config
Configuration should be dull. Less abracadabra.

node.js 4x and up. Not sure about browsers

## Philosophy
After looking around at the truly awesome nconf, convict, node-config I decided I wanted to try something simpler.

Here are the goals

* Plain JavaScript Objects, both in and out.
* Keep different environment setting in the same file
* Load secret things from the environment i.e. `process.env.PASSWORD`
* No magic searching for config files or file glob loading. Just load files with require()
* Protect from typos and name changes by throwing when accessing an unknown config

This lets you compute your configs or load them from the network as JSON. You use process.env or command line args to set specific configs. You can put your config all in one file or in many files or in the startup file. Its up to you. You can even use validator or joi to validate your config since what you get out are plan JS objects.


That's really it. Its not even that much code 90 loc with docs :-)  Not including dependancies.

### Installation

not live on npm yet. but when it is.
```
$ npm install dullconfig
```

### Usage

```js
const config = require('config')
I
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

## API

[Doclet link](https://doclets.io/toddgeist/dull-config/master)