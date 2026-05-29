"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MenuController = __importStar(require("../controllers/menu.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const menu_validation_1 = require("../validations/menu.validation");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const router = (0, express_1.Router)();
router.get('/', MenuController.getMenu);
router.post('/', auth_middleware_1.protect, upload_middleware_1.default.array('images', 10), MenuController.create);
// Admin Management
router.post('/', auth_middleware_1.protect, (0, validate_middleware_1.validate)(menu_validation_1.createMenuItemSchema), upload_middleware_1.default.array('images', 10), MenuController.create);
router.put('/:id', auth_middleware_1.protect, (0, validate_middleware_1.validate)(menu_validation_1.updateMenuItemSchema), upload_middleware_1.default.array('images', 10), MenuController.updateItem);
router.patch('/:id/toggle', auth_middleware_1.protect, (0, validate_middleware_1.validate)(menu_validation_1.toggleSchema), MenuController.toggleAvailability);
router.delete('/:id', auth_middleware_1.protect, MenuController.deleteItem);
exports.default = router;
