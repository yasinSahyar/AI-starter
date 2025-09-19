import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import fetchData from '../../lib/fetchData';
// import { ChatCompletion } from 'openai/resources/index';
import OpenAI from "openai";

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {

    try {
      const request = {
        messages: [
          {
            role: 'developer',
            content: 'You are an AI coding assistant that helps developers by providing code suggestions and improvements based on the comments they provide.',
          },
          {
            role: 'user',
            content: req.body.text,
          },
        ],
        model: 'gpt-5-nano',
      }
        if (!process.env.OPENAI_API_URL) {
          next(new CustomError ('OPENAI_API_URL is not defined in environment variables', 500));
        }
        const completion = await fetchData<ChatCompletion>(
          process.env.OPENAI_API_URL + '/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          } 
        );
        if(!completion.choices[0].message.content){
          next(new CustomError ('No response from AI', 500));
          return
        }
        res.json({response: completion.choices[0].message.content});
      
    } catch (error) {
    next(error);
  }
};


export {commentPost};