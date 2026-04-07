"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    url: process.env.APP_URL ?? 'http://localhost:4000',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
}));
//# sourceMappingURL=app.config.js.map