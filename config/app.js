module.exports = {
  database: process.env.DB_URL,
  token: {
    secret: process.env.JWT_STRATEGY_SECRET
  },

};