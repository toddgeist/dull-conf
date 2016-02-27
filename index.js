'use strict';
/**
 * dull config module
 * @type {_|exports|module.exports}
 * @private
 */


const _ = require('lodash');
const makeError  = require ('make-error');


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
 * Config
 * @type {{get: (function(string)), has: (function(string): boolean), load: (function(Object)), toJSON: (function(*=))}}
 */
const config = {

  /**
   * Gets the value of a config. It will throw if misspelled.
   * Use {@link has} to check for a configs existannce without throwing.
   * @param path {string} for ex 'db.password'
   * @see has {@link has}
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
   * Checks to see if the config setting exists.
   * it will not throw if it doesn't exist
   * @param path {string}
   * @returns {boolean}
   */
  has(path){
    return _.has(configStore, path)
  },


  /**
   * Load a config object.
   * @param obj {object}
   */
  load(obj){

    Object.keys(obj).map(( key )=>{
      configStore[key] = loader(obj[key])
    })

  },

  /**
   * loads a config object that will merge with the currentStore
   * useful for testing, local dev setups, and old school deployments.
   * @param fullPath a full path to the file. a relative path won't work
   * @returns {boolean} If the file loaded it returns true. If not it returns false
   */
  loadLocal(fullPath){
    if(fullPath && typeof fullPath  != 'string'){
      throw new TypeError('loadLocal requires a string')
    }
    try{
      let configModule = require(fullPath)
      configStore = _.merge({},configStore,configModule)
      return true
    }catch(e){
      return false;
    }
  }

};

module.exports = config;