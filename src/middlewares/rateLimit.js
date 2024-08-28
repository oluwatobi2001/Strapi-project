
'use strict';

/**
 * RateLimit middleware
 */
const utils = require("@strapi/utils");
const { RateLimitError } = utils.errors;

// Store the requests in memory (you might want to use a more persistent store in production)
const requestCounts = new Map();

module.exports = (config, { strapi }) => {
  // Get the rate limit configuration from Strapi's admin settings
  const rateLimitConfig = strapi.config.get('admin.rateLimit', {
    interval: 60 * 1000,  // default time window in milliseconds (1 minute)
    max: 5,  // default maximum number of requests per interval
  });

  return async (ctx, next) => {
    strapi.log.info('In RateLimit middleware.');

    const ip = ctx.ip; // or use ctx.request.ip if needed
    const currentTime = Date.now();

    if (!requestCounts.has(ip)) {
      // Initialize the record for this IP
      requestCounts.set(ip, { count: 1, startTime: currentTime });
    } else {
      const requestInfo = requestCounts.get(ip);

      // Reset the count if the interval has passed
      if (currentTime - requestInfo.startTime > rateLimitConfig.interval) {
        requestInfo.count = 1;
        requestInfo.startTime = currentTime;
      } else {
        // Increment the count if within the interval
        requestInfo.count += 1;
      }

      // Check if the request count exceeds the maximum allowed
      if (requestInfo.count > rateLimitConfig.max) {
        strapi.log.warn(`Rate limit exceeded for IP: ${ip}`);

        ctx.status = 429;
        ctx.body = {
          statusCode: 429,
          error: 'Too Many Requests',
          message: 'You have exceeded the maximum number of requests. Please try again later.',
        };
        return;
      }
    }

    await next();
  };
};

