"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation Error",
            errors: err.errors.map((e) => ({ field: e.path[1], message: e.message })),
        });
    }
    if (err.code === "P2002") {
        return res.status(400).json({ message: "Email already exists" });
    }
    if (err.message.includes("Invalid value for argument")) {
        return res
            .status(400)
            .json({ message: "Invalid data provided for fields like Role" });
    }
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
