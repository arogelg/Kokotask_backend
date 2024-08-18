"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.corsConfig = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];
        if (process.argv[2] === '--api') {
            whitelist.push(undefined);
        }
        if (whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`CORS error: origin ${origin} not allowed by CORS`);
            callback(new Error('Error by CORS'));
        }
    }
};
//# sourceMappingURL=cors.js.map