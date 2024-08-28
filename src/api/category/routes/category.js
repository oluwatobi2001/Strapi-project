'use strict';

/**
 * category router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const RateLimit = require("koa2-ratelimit").RateLimit;

module.exports = createCoreRouter('api::category.category');
