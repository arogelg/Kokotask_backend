"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.corsConfig = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];

        if (process.argv.includes('--api')) {
            whitelist.push(undefined); // Allow undefined origins if running with --api
        }

        // Allow all origins if FRONTEND_URL is not set (for testing purposes)
        if (!process.env.FRONTEND_URL || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS error: origin ${origin} not allowed by CORS`);
            callback(new Error('Error by CORS'));
        }
    },
    credentials: true, // Allow cookies and other credentials if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify the allowed headers
};