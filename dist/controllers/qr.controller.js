"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedirect = exports.listQrs = exports.getQrImage = exports.createQr = void 0;
const qr_service_1 = require("../services/qr.service");
// ADMIN: Create a new QR code
const createQr = async (req, res, next) => {
    try {
        const adminId = req.user.id;
        const qr = await qr_service_1.QrService.create(req.body.name, adminId);
        res.status(201).json(qr);
    }
    catch (error) {
        next(error);
    }
};
exports.createQr = createQr;
// ADMIN: Get the image to print
const getQrImage = async (req, res, next) => {
    try {
        const image = await qr_service_1.QrService.generateImage(req.params.shortId);
        res.json({ image });
    }
    catch (error) {
        next(error);
    }
};
exports.getQrImage = getQrImage;
// ADMIN: List all QR codes with scan totals
const listQrs = async (req, res, next) => {
    try {
        const qrs = await qr_service_1.QrService.getAll();
        res.json(qrs);
    }
    catch (error) {
        next(error);
    }
};
exports.listQrs = listQrs;
// PUBLIC: THE REDIRECTOR (This handles the actual scan)
const handleRedirect = async (req, res, next) => {
    try {
        const { shortId } = req.params;
        const qr = await qr_service_1.QrService.getByShortId(shortId);
        if (!qr)
            return res.status(404).send("Invalid QR Code");
        // Background: Log the scan (no await to keep redirect fast)
        qr_service_1.QrService.logScan(qr.id);
        // Redirect to your frontend URL
        const frontendUrl = `http://localhost:3000`;
        res.redirect(frontendUrl);
    }
    catch (error) {
        next(error);
    }
};
exports.handleRedirect = handleRedirect;
