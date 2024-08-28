

'use strict';

/**
 * `RateLimit` middleware
 */
const RateLimit = require("koa2-ratelimit").RateLimit;
const utils = require("@strapi/utils");
const { RateLimitError } = utils.errors;

module.exports = (config, { strapi }) => {
  // Configuring the rate limiter middleware
  const limiter = RateLimit.middleware({
    interval: { min: 1 }, // Time window in minutes
    max: 3, 
  });

  return async (ctx, next) => {
    let rateLimitConfig = strapi.config.get('admin.rateLimit');
    strapi.log.info('In RateLimit middleware.');

    try {
      // Apply the rate limiter to the current request
      await limiter(ctx, next);
    } catch (err) {
      if (err.status === 429) {
        // Handle rate limit exceeded error
        strapi.log.warn('Rate limit exceeded.');
        ctx.status = 429;
        ctx.body = {
          statusCode: 429,
          error: 'Too Many Requests',
          message: 'You have exceeded the maximum number of requests. Please try again later.',
        };
      } else {
        
        throw err;
      }
    }
  };
};
