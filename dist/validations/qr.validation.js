"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQrSchema = void 0;
const zod_1 = require("zod");
exports.createQrSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "QR Name is required (e.g. Table 5)"),
    }),
});
