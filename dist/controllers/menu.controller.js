"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.toggleAvailability = exports.updateItem = exports.create = exports.getMenuByQr = exports.getMenu = void 0;
const menu_service_1 = require("../services/menu.service");
/* ================================
   GET MENU
================================ */
const getMenu = async (req, res, next) => {
    try {
        const { categoryId, search, adminView } = req.query;
        const items = await menu_service_1.MenuService.getMenu(categoryId, search, adminView === 'true');
        res.json({
            success: true,
            data: items,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMenu = getMenu;
/* ================================
   GET MENU BY QR
================================ */
const getMenuByQr = async (req, res, next) => {
    try {
        const items = await menu_service_1.MenuService.getMenuByQr(req.params.shortId);
        res.json({
            success: true,
            data: items,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMenuByQr = getMenuByQr;
/* ================================
   CREATE MENU ITEM
================================ */
const create = async (req, res, next) => {
    try {
        const body = req.body;
        const files = (req.files || []);
        const payload = {
            ...body,
            price: Number(body.price),
            oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
            preparationTime: body.preparationTime
                ? Number(body.preparationTime)
                : null,
            spicyLevel: Number(body.spicyLevel || 0),
            calories: body.calories ? Number(body.calories) : null,
            isFeatured: body.isFeatured === 'true',
            isAvailable: body.isAvailable !== 'false',
            ingredients: body.ingredients
                ? body.ingredients.split(',').map((i) => i.trim())
                : [],
            allergens: body.allergens
                ? body.allergens.split(',').map((i) => i.trim())
                : [],
            images: files.map((file, index) => ({
                imageUrl: file.path.replace(/\\/g, '/'),
                isPrimary: index === 0,
            })),
        };
        const item = await menu_service_1.MenuService.create(payload, req.user.id);
        res.status(201).json({
            success: true,
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
/* ================================
   UPDATE MENU ITEM
================================ */
const updateItem = async (req, res, next) => {
    try {
        const body = req.body;
        const files = (req.files || []);
        const payload = {
            ...body,
            price: body.price ? Number(body.price) : undefined,
            oldPrice: body.oldPrice === ''
                ? null
                : body.oldPrice
                    ? Number(body.oldPrice)
                    : undefined,
            preparationTime: body.preparationTime === ''
                ? null
                : body.preparationTime
                    ? Number(body.preparationTime)
                    : undefined,
            spicyLevel: body.spicyLevel !== undefined ? Number(body.spicyLevel) : undefined,
            calories: body.calories === ''
                ? null
                : body.calories
                    ? Number(body.calories)
                    : undefined,
            isFeatured: body.isFeatured !== undefined ? body.isFeatured === 'true' : undefined,
            isAvailable: body.isAvailable !== undefined
                ? body.isAvailable === 'true'
                : undefined,
            ingredients: body.ingredients
                ? body.ingredients.split(',').map((i) => i.trim())
                : undefined,
            allergens: body.allergens
                ? body.allergens.split(',').map((i) => i.trim())
                : undefined,
            images: files.length > 0
                ? files.map((file, index) => ({
                    imageUrl: file.path.replace(/\\/g, '/'),
                    isPrimary: index === 0,
                }))
                : undefined,
        };
        const updated = await menu_service_1.MenuService.update(req.params.id, payload);
        res.json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.updateItem = updateItem;
/* ================================
   TOGGLE AVAILABILITY
================================ */
const toggleAvailability = async (req, res, next) => {
    try {
        const updated = await menu_service_1.MenuService.toggle(req.params.id, req.body.isAvailable);
        res.json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleAvailability = toggleAvailability;
/* ================================
   DELETE MENU ITEM
================================ */
const deleteItem = async (req, res, next) => {
    try {
        await menu_service_1.MenuService.remove(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteItem = deleteItem;
