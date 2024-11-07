"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBaseUrl = void 0;
const setBaseUrl = (req, res, next) => {
    // Get the base URL from the request headers
    req.baseUrl = `${req.protocol}://${req.get('host')}`;
    next();
};
exports.setBaseUrl = setBaseUrl;
