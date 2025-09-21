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
      // A more descriptive prompt for better image quality
      prompt: `A high-quality, photorealistic image of a dish called "${req.body.dish_name}". It is a ${req.body.dish_type}. The dish is described as: "${req.body.description}". The image should be well-lit, appetizing, and styled for a gourmet food magazine.`,
      size: '1024x1024',
      quality: 'hd', // Request a higher quality image
      n: 1,
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
  try {
    if (!res.locals.url) {
      res.locals.filename = 'default.png';
      return next();
    }

    const imageName =
      req.body.dish_name.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
    const imagePath = './uploads/' + imageName;

    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(imagePath);
      https.get(res.locals.url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          // file.close() is async, wait for it to finish
          file.close(() => {
            console.log(`Image downloaded from ${res.locals.url}`);
            res.locals.filename = imageName;
            resolve();
          });
        });
      }).on('error', (err) => {
        // Try to delete the partial file on error
        fs.unlink(imagePath, () => reject(err));
      });
    });

    next();
  } catch (error) {
    console.error('Failed to save AI image:', error);
    res.locals.filename = 'default.png';
    next();
  }
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