'use strict';

/**
 * product router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const { rateLimit } = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 2,
handler: async(req, res, next) => {
const ctx = strapi.requestContext.get();
ctx.status = 429;
ctx.body ={
    message: "Too many requests",
    policy : "rate limit"
}
}
}) 
module.exports = createCoreRouter('api::product.product', {
    config: {
        find: {
            middlewares : [
                
                    async (ctx, next) => {
limiter(ctx.req, ctx.res, (error) =>{
    if(error) {
        ctx.status = 429;
        ctx.body = { error: error.message}
    }
});
await next();
                    }
                
            ]
        }
    }
});
