const RateLimit = require("../src/middlewares/rateLimit");

module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  RateLimiter : {
    enabled: true,
    rateLimiter : require('../src/middlewares/rateLimit')
  }
};
