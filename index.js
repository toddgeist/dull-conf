'use strict';
const _ = require('lodash');
const makeError  = require ('make-error')


/**
 * private store for the config object
 * @private
 * @type {{}}
 */
let configStore = {};


/**
 * Custom Config Error
 * @private
 */
const ConfigError = makeError('ConfigError');


/**
 * merges defaults and environmental settings with in the same file
 * @private
 * @param obj
 * @returns {*}
 */
const loader = (obj)=>{

  let env = process.env.NODE_ENV || 'development';
  if(!obj.default){
    // new object, avoid mutation
    return Object.assign({},obj)
  }
  let envObj = {};
  if(obj[env]){
    envObj = obj[env]
  }

  // deep merge
  return _.merge({},obj.default,envObj)

};


/**
 * main export
 * @type {{get: (function(string)), has: (function(string): boolean), load: (function(Object)), toJSON: (function(*=))}}
 */
module.exports = {

  /**
   * gets a part of the config
   * with throw if misspelled
   * @param path {string}
   */
  get(path){

    if(!path){
      return configStore
    }

    if(!_.has(configStore, path)){
      let msg = `Not Set!. The config "${path}" was not loaded. Check for typos or changed config names.`;
      throw new ConfigError(msg)
    }

    let value = _.get(configStore, path );
    if(typeof value === 'undefined'){
      let msg = `Loaded Undefined!. The config "${path}" was loaded as undefined.`;
      throw new ConfigError(msg)
    }
    return value

  },


  /**
   *
   * @param path {string}
   * @returns {boolean}
   */
  has(path){
    return _.has(configStore, path)
  },


  /**
   * load a config object
   * @param obj {object}
   */
  load(obj){

    Object.keys(obj).map(( key )=>{
      configStore[key] = loader(obj[key])
    })

  }

};

