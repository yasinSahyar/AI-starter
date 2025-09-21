import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {Dish} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';

// Get all dishes
const getDishes = async (
  _req: Request,
  res: Response<Dish[]>,
  next: NextFunction
) => {
  try {
    // TODO: Implement database query to get all dishes
    const dishes: Dish[] = [];
    res.json(dishes);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Get dish by ID
const getDish = async (
  req: Request<{id: string}>,
  res: Response<Dish>,
  next: NextFunction
) => {
  try {
    // TODO: Implement database query to get dish by ID using req.params.id
    const dish: Dish = {} as Dish;
    if (!dish) {
      throw new CustomError('Dish not found', 404);
    }
    res.json(dish);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Create new dish (with AI image generation)
const createDish = async (
  req: Request<{}, {}, Omit<Dish, 'dish_id'>>,
  res: Response<MessageResponse, {filename: string}>,
  next: NextFunction
) => {
  try {
    const dishData = {
      ...req.body,
      filename: res.locals.filename || 'default.png'
    };
    // TODO: Implement database insert
    console.log('Creating dish:', dishData);
    console.log('Generated image filename:', res.locals.filename || 'default.png');
    
    res.status(201).json({
      message: `Dish "${dishData.dish_name}" created successfully with image: ${dishData.filename}`
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Update dish
const updateDish = async (
  req: Request<{id: string}, {}, Partial<Dish>>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    const updateData = req.body;
    // TODO: Implement database update
    console.log('Updating dish:', id, updateData);
    res.json({message: 'Dish updated successfully'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Delete dish
const deleteDish = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    // TODO: Implement database delete
    console.log('Deleting dish:', id);
    res.json({message: 'Dish deleted successfully'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {getDishes, getDish, createDish, updateDish, deleteDish};