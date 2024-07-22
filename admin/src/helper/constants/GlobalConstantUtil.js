module.exports = Object.freeze({
  AXIOS_HELPER: {
    BEARER: 'Bearer',
    JWT_AUTHENTICATION: 'jwt_authentication',
    ACCESS_TOKEN: 'accessToken',
    SIGN_IN: '/sign-in'
  },

  ORDER_STATUS: [
    {
      code: 'payment pending',
      color: 'gray'
    },
    {
      code: 'order placed',
      color: 'blue'
    },
    {
      code: 'order cancelled',
      color: 'red'
    },
    {
      code: 'order delivered',
      color: 'green'
    },
    {
      code: 'return requested',
      color: 'purple'
    },
    {
      code: 'return approved',
      color: 'teal'
    },
    {
      code: 'return cancelled',
      color: 'red'
    },
    {
      code: 'order returned',
      color: 'gray'
    }
  ],

  PRODUCT_PROPERTIES: [
    {
      key: '',
      value: ''
    }
  ]
});
