module.exports = {
  default : {
    url : 'this.is.the.default',
    userName : process.env.DB_USER_NAME,
    password : process.env.DB_PASSWORD
  },
  production : {
    url : 'production'
  }
};