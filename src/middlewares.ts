/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import sharp from 'sharp';
import {ErrorResponse} from './types/MessageTypes';
import CustomError from './classes/CustomError';
import {FieldValidationError, validationResult} from 'express-validator';
import https from 'https';
import fs from 'fs';
import OpenAI from 'openai';
import {Dish} from './types/DBTypes';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  // console.error('errorHandler', chalk.red(err.stack));
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const makeThumbnail = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Thumbnail for:', res.locals.filename);
    
    // Only create thumbnail if we have a real image file (not default.png)
    if (!res.locals.filename || res.locals.filename === 'default.png') {
      console.log('Skipping thumbnail creation for default image');
      next();
      return;
    }

    await sharp(`./uploads/${res.locals.filename}`)
      .resize(160, 160)
      .png()
      .toFile(`./uploads/thumb_${res.locals.filename}`);
    console.log('Thumbnail created successfully');
    next();
  } catch (error) {
    console.log('Thumbnail creation failed:', error);
    next();
  }
};

const getAiImage = async (
  req: Request<{}, {}, Omit<Dish, 'dish_id'>>,
  res: Response<{}, {url: string}>,
  next: NextFunction,
) => {
  try {
    // Check if we have a valid API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder_key') {
      console.log('Skipping AI image generation - no valid API key');
      next();
      return;
    }

    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: `Name of dish: ${req.body.dish_name}. The description of the dish: ${req.body.description}. Type of the dish: ${req.body.dish_type}.`,
      size: '1024x1024',
    });
    if (
      !response.data ||
      !Array.isArray(response.data) ||
      !response.data[0] ||
      !response.data[0].url
    ) {
      throw new CustomError('Image not generated', 500);
    }
    res.locals.url = response.data[0].url;
    next();
  } catch (error) {
    console.log('AI image generation failed:', error);
    next();
  }
};

const saveAiImage = async (
  req: Request<{}, {}, Omit<Dish, 'dish_id'>>,
  res: Response<{}, {filename: string; url: string}>,
  next: NextFunction,
) => {
  const imageName = req.body.dish_name.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
  
  if (!res.locals.url) {
    res.locals.filename = 'default.png';
    next();
    return;
  }

  const file = fs.createWriteStream('./uploads/' + imageName);

  https
    .get(res.locals.url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Image downloaded from ${res.locals.url}`);
      });
    })
    .on('error', (err) => {
      fs.unlink('./uploads/' + imageName, () => {
        console.error(`Error downloading image: ${err.message}`);
      });
      res.locals.filename = 'default.png';
    });
  
  res.locals.filename = imageName;
  next();
};

const validate = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${(error as FieldValidationError).path}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

export {
  notFound,
  errorHandler,
  makeThumbnail,
  getAiImage,
  saveAiImage,
  validate,
};