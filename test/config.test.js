

const expect = require('expect.js')
const config = require('../');

config.load({
  email : { to : 'todd@geistinteractive.com' }
});

config.load({
  db : require('../examples/db'),
  auth : require('../examples/auth')
});




describe('Config' , function() {
  it('should work ' , function( done ) {
    expect(config.get('email.to')).to.equal('todd@geistinteractive.com')
    done()
  })
});