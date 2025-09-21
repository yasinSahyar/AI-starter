import express from 'express';
import {body, param} from 'express-validator';
import {
  validate,
  getAiImage,
  saveAiImage,
  makeThumbnail,
} from '../../middlewares';
import {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController';

const router = express.Router();

// Validation rules
const dishValidation = [
  body('dish_name')
    .notEmpty()
    .withMessage('Dish name is required')
    .isLength({min: 2, max: 100})
    .withMessage('Dish name must be between 2-100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({min: 10, max: 500})
    .withMessage('Description must be between 10-500 characters'),
  body('dish_type')
    .notEmpty()
    .withMessage('Dish type is required')
    .isString()
    .withMessage('Dish type must be a string'),
];

const updateDishValidation = [
  body('dish_name')
    .optional()
    .isLength({min: 2, max: 100})
    .withMessage('Dish name must be between 2-100 characters'),
  body('description')
    .optional()
    .isLength({min: 10, max: 500})
    .withMessage('Description must be between 10-500 characters'),
  body('dish_type')
    .optional()
    .isString()
    .withMessage('Dish type must be a string'),
];

const idValidation = [
  param('id').isInt({min: 1}).withMessage('ID must be a positive integer'),
];

// Routes
router.route('/')
  .get(getDishes)
  .post(
    dishValidation,
    validate,
    getAiImage,
    saveAiImage,
    makeThumbnail,
    createDish
  );

router.route('/:id')
  .get(idValidation, validate, getDish)
  .put(idValidation, updateDishValidation, validate, updateDish)
  .delete(idValidation, validate, deleteDish);

export default router;