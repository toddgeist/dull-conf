module.exports = {

  default: {
    secret: process.env.SECRET,
    make: {
      up: {
        super: {
          deep: {
            setting: 'iamdeep-default',
            setting2: 'iamalsodeep'
          }
        }
      }
    }
  },
  production : {
    make: {
      up: {
        super: {
          deep: {
            setting: 'iamdeep-production',
          }
        }
      }
    }
  }
};