import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';

/* ================================
   GET MENU
================================ */
export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId, search, adminView } = req.query;

    const items = await MenuService.getMenu(
      categoryId as string,
      search as string,
      adminView === 'true',
    );

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   GET MENU BY QR
================================ */
export const getMenuByQr = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await MenuService.getMenuByQr(req.params.shortId);

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   CREATE MENU ITEM
================================ */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;

    const files = (req.files || []) as Express.Multer.File[];

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
        ? body.ingredients.split(',').map((i: string) => i.trim())
        : [],

      allergens: body.allergens
        ? body.allergens.split(',').map((i: string) => i.trim())
        : [],

      images: files.map((file, index) => ({
        imageUrl: file.path.replace(/\\/g, '/'),
        isPrimary: index === 0,
      })),
    };

    const item = await MenuService.create(payload, (req as any).user.id);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   UPDATE MENU ITEM
================================ */
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;

    const files = (req.files || []) as Express.Multer.File[];

    const payload = {
      ...body,

      price: body.price ? Number(body.price) : undefined,

      oldPrice:
        body.oldPrice === ''
          ? null
          : body.oldPrice
            ? Number(body.oldPrice)
            : undefined,

      preparationTime:
        body.preparationTime === ''
          ? null
          : body.preparationTime
            ? Number(body.preparationTime)
            : undefined,

      spicyLevel:
        body.spicyLevel !== undefined ? Number(body.spicyLevel) : undefined,

      calories:
        body.calories === ''
          ? null
          : body.calories
            ? Number(body.calories)
            : undefined,

      isFeatured:
        body.isFeatured !== undefined ? body.isFeatured === 'true' : undefined,

      isAvailable:
        body.isAvailable !== undefined
          ? body.isAvailable === 'true'
          : undefined,

      ingredients: body.ingredients
        ? body.ingredients.split(',').map((i: string) => i.trim())
        : undefined,

      allergens: body.allergens
        ? body.allergens.split(',').map((i: string) => i.trim())
        : undefined,

      images:
        files.length > 0
          ? files.map((file, index) => ({
              imageUrl: file.path.replace(/\\/g, '/'),
              isPrimary: index === 0,
            }))
          : undefined,
    };

    const updated = await MenuService.update(req.params.id, payload);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

/* ================================
   TOGGLE AVAILABILITY
================================ */
export const toggleAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updated = await MenuService.toggle(
      req.params.id,
      req.body.isAvailable,
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/* ================================
   DELETE MENU ITEM
================================ */
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await MenuService.remove(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
