module.exports = {
  default : {
    url : 'this.is.the.default',
    userName : process.env.DB_USER_NAME,
    password : process.env.PASSWORD
  },
  production : {
    url : 'production'
  }
};