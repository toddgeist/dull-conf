const expect = require('expect.js');
const config = require('../');

const SECRET = 'MY_COOL_SECRET';
const DB_USER_NAME = 'my db user name';
const DB_PASSWORD = 'my db password';


//so we can call it several times in our tests
//simulating a load under different NODE_ENV
const loadConfigForTest = (env) =>{

  process.env.NODE_ENV=env;
  config.load({
    email : { to : 'todd@geistinteractive.com',mistake : undefined },

  });

  config.load({
    db : require('../examples/db'),
    auth : require('../examples/auth')
  });
};


before(()=>{
  // set some SECRET stuff for use in the config
  process.env.SECRET = SECRET;
  process.env.DB_USER_NAME = DB_USER_NAME;
  process.env.DB_PASSWORD = DB_PASSWORD

});


describe('Loaded with NODE_ENV not set' , function() {

  before((done)=>{
    loadConfigForTest();
    console.log(config.get('email'));
    done()
  });


  it('should work when obj has no default or env ' , function( done ) {
    expect(config.get('email.to')).to.equal('todd@geistinteractive.com')
    done()
  });

  it('should get a default setting' , function( done ) {
    expect(config.get('db.url')).to.equal('this.is.the.default')
    done()
  });

  it('should get the full object with null or "" path' , function( done ) {
    expect(config.get('')).to.be.an('object');
    expect(config.get()).to.be.an('object');
    done()
  });


  it('should throw an error with bad path' , function( done ) {
    const shouldThrowBadPath = () =>{
      return config.get('bad.path')
    };


    expect(shouldThrowBadPath).to.throwError(/Not Set!/);
    done()
  });

  it('should throw an error with a undefined load ' , function( done ) {
    const shouldThrowBadLoad = () =>{
      return config.get('email.mistake')
    };

    expect(shouldThrowBadLoad).to.throwError(/Loaded Undefined!/);
    done()
  })

});

describe('Loaded with NODE_ENV set to "development"' , function() {

  before((done)=>{
    loadConfigForTest('development');
    done()
  });

  it('should work when obj has no default or env ' , function( done ) {
    expect(config.get('email.to')).to.equal('todd@geistinteractive.com')
    done()
  });

  it('should get a default setting' , function( done ) {
    expect(config.get('db.url')).to.equal('this.is.the.default')
    done()
  });

  it('should get a ENV var' , function( done ) {
    expect(config.get('auth.secret')).to.equal(SECRET);
    done()
  })
});

describe('Loaded with NODE_ENV set to "production"' , function() {

  before((done)=>{
    loadConfigForTest('production');
    done()
  });

  it('should work when obj has no default or env ' , function( done ) {
    expect(config.get('email.to')).to.equal('todd@geistinteractive.com');
    done()
  });

  it('should get a default setting' , function( done ) {
    expect(config.get('db.url')).to.equal('production');
    done()
  });

  it('should get a default setting when not over written' , function( done ) {
    expect(config.get('db.userName')).to.equal(DB_USER_NAME);
    done()
  });
  it('should get a very deep overwritten value' , function( done ) {
    expect(config.get('auth.make.up.super.deep.setting')).to.equal('iamdeep-production');
    done()
  });
  it('should get a very deep NOT overwritten value' , function( done ) {
    expect(config.get('auth.make.up.super.deep.setting2')).to.equal('iamalsodeep');
    done()
  })

});

describe('localConfig', function () {

  before((done)=>{
    loadConfigForTest();
    // in case the user doesn't have a local config use try catch
    try{
      config.loadLocal(require('../examples/local'))
    }catch(e){
      //no-op
    }

    done()
  });

  it('should override a previously loaded config' , function( done ) {
    expect(config.get('db.url')).to.be('local');
    done();
  });

});