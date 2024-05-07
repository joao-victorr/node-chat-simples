"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorMiddleware = (error, req, res, next) => {
    console.log(error.message);
    const statusCode = error.statusCode ?? 500;
    const message = error.statusCode ? error.message : "Inexpected Server Error";
    return res.status(statusCode).json({ error: message });
};
exports.ErrorMiddleware = ErrorMiddleware;
//# sourceMappingURL=ErrorsMiddleware.js.map