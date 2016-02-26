'use strict';
const objectPath = require('object-path');
const _ = require('lodash');
const env = process.env.NODE_ENV || 'development';

/**
 * merges defaults and environmental settings with the same file
 * @param obj
 * @returns {*}
 */
const loader = (obj)=>{

  if(!obj.default){
    return obj
  }
  let envObj = {}
  if(obj[env]){
    envObj = obj[env]
  }

  return Object.assign({},obj.default,envObj )
};

/**
 * private store for the config object
 * @type {{}}
 */
const configStore = {};

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

    if(!_.has(configStore, path)){
      let msg = `ConfigError: the config "${path}" was not loaded. Check for typos`;
      throw new Error(msg)
    }

    let value = objectPath.get(configStore, path );
    if(typeof value === 'undefined'){
      let msg = `Config Error: the config "${path}" was set to undefined on load.`;
      throw new Error(msg)
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
      configStore[key]=loader(obj[key])
    })
  }

};

