import { Request, Response, NextFunction } from "express";
import * as CategoryService from "../services/category.service";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await CategoryService.getAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = (req as any).user.id;
    const category = await CategoryService.create(req.body.name, adminId);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await CategoryService.update(req.params.id, req.body.name);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await CategoryService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
