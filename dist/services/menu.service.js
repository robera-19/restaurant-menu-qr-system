"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const prisma_1 = require("../config/prisma");
const toNum = (value) => value === '' || value === null || value === undefined ? null : Number(value);
const toBool = (value) => value === true || value === 'true';
const includeDetails = {
    images: true,
    category: {
        select: {
            id: true,
            name: true,
        },
    },
    ratings: {
        select: {
            ratingValue: true,
        },
    },
};
const formatItem = (item) => {
    const total = item.ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const average = item.ratings.length ? total / item.ratings.length : 0;
    return {
        ...item,
        ratings: undefined,
        ratingAverage: Number(average.toFixed(1)),
        totalRatings: item.ratings.length,
    };
};
exports.MenuService = {
    // get all menu
    getMenu: async (categoryId, search, adminView = false) => {
        const items = await prisma_1.prisma.menuItem.findMany({
            where: {
                ...(adminView ? {} : { isAvailable: true }),
                ...(categoryId?.trim() && {
                    categoryId,
                }),
                ...(search?.trim() && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }),
            },
            include: includeDetails,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return items.map(formatItem);
    },
    // get menu by qr
    getMenuByQr: async (shortId) => {
        const qr = await prisma_1.prisma.qrCode.findUnique({
            where: {
                shortId,
            },
        });
        if (!qr) {
            throw new Error('Invalid QR Code');
        }
        await prisma_1.prisma.qrScan.create({
            data: {
                qrCodeId: qr.id,
            },
        });
        const items = await prisma_1.prisma.menuItem.findMany({
            where: {
                isAvailable: true,
            },
            include: includeDetails,
            orderBy: {
                name: 'asc',
            },
        });
        return items.map(formatItem);
    },
    // create menu item
    create: async (data, adminId) => {
        const { images, ...body } = data;
        const item = await prisma_1.prisma.$transaction(async (tx) => {
            const created = await tx.menuItem.create({
                data: {
                    name: body.name?.trim(),
                    categoryId: body.categoryId,
                    price: toNum(body.price) || 0,
                    oldPrice: toNum(body.oldPrice),
                    description: body.description || null,
                    preparationTime: toNum(body.preparationTime),
                    spicyLevel: toNum(body.spicyLevel) || 0,
                    calories: toNum(body.calories),
                    protein: body.protein || null,
                    carbs: body.carbs || null,
                    fat: body.fat || null,
                    isFeatured: toBool(body.isFeatured),
                    isAvailable: body.isAvailable !== 'false',
                    ingredients: body.ingredients || [],
                    allergens: body.allergens || [],
                    createdBy: adminId,
                },
            });
            if (images?.length) {
                await tx.menuItemImage.createMany({
                    data: images.map((img, index) => ({
                        imageUrl: img.imageUrl,
                        isPrimary: index === 0,
                        menuItemId: created.id,
                    })),
                });
            }
            return tx.menuItem.findUnique({
                where: {
                    id: created.id,
                },
                include: includeDetails,
            });
        });
        return formatItem(item);
    },
    // update menu item
    update: async (id, data) => {
        const { images, ...body } = data;
        const item = await prisma_1.prisma.$transaction(async (tx) => {
            await tx.menuItem.update({
                where: {
                    id,
                },
                data: {
                    ...(body.name !== undefined && {
                        name: body.name?.trim(),
                    }),
                    ...(body.categoryId !== undefined && {
                        categoryId: body.categoryId,
                    }),
                    ...(body.description !== undefined && {
                        description: body.description,
                    }),
                    ...(body.price !== undefined &&
                        toNum(body.price) !== null && {
                        price: toNum(body.price),
                    }),
                    ...(body.oldPrice !== undefined &&
                        toNum(body.oldPrice) !== null && {
                        oldPrice: toNum(body.oldPrice),
                    }),
                    ...(body.preparationTime !== undefined &&
                        toNum(body.preparationTime) !== null && {
                        preparationTime: toNum(body.preparationTime),
                    }),
                    ...(body.spicyLevel !== undefined &&
                        toNum(body.spicyLevel) !== null && {
                        spicyLevel: toNum(body.spicyLevel),
                    }),
                    ...(body.calories !== undefined &&
                        toNum(body.calories) !== null && {
                        calories: toNum(body.calories),
                    }),
                    ...(body.protein !== undefined && {
                        protein: body.protein,
                    }),
                    ...(body.carbs !== undefined && {
                        carbs: body.carbs,
                    }),
                    ...(body.fat !== undefined && {
                        fat: body.fat,
                    }),
                    ...(body.isFeatured !== undefined && {
                        isFeatured: toBool(body.isFeatured),
                    }),
                    ...(body.isAvailable !== undefined && {
                        isAvailable: toBool(body.isAvailable),
                    }),
                    ...(body.ingredients !== undefined && {
                        ingredients: body.ingredients,
                    }),
                    ...(body.allergens !== undefined && {
                        allergens: body.allergens,
                    }),
                },
            });
            if (images?.length) {
                await tx.menuItemImage.deleteMany({
                    where: {
                        menuItemId: id,
                    },
                });
                await tx.menuItemImage.createMany({
                    data: images.map((img, index) => ({
                        imageUrl: img.imageUrl,
                        isPrimary: index === 0,
                        menuItemId: id,
                    })),
                });
            }
            return tx.menuItem.findUnique({
                where: {
                    id,
                },
                include: includeDetails,
            });
        });
        return formatItem(item);
    },
    // toggle availability
    toggle: async (id, isAvailable) => {
        const item = await prisma_1.prisma.menuItem.update({
            where: {
                id,
            },
            data: {
                isAvailable,
            },
            include: includeDetails,
        });
        return formatItem(item);
    },
    // delete menu item
    remove: async (id) => {
        return prisma_1.prisma.$transaction(async (tx) => {
            await tx.menuItemImage.deleteMany({
                where: {
                    menuItemId: id,
                },
            });
            await tx.rating.deleteMany({
                where: {
                    menuItemId: id,
                },
            });
            return tx.menuItem.delete({
                where: {
                    id,
                },
            });
        });
    },
};
