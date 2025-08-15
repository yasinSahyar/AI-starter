import {Request, Response, NextFunction} from 'express';

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    try {
      // TODO: Generate a response to a Youtube comment
      // Instead of using openai library, use fetchData to make a post request to the server.
      // see https://platform.openai.com/docs/api-reference/chat/create for more information
      // You don't need an API key if you put the URL provided in Oma to .env.sample and Metropolia VPN
      // Example: instad of https://api.openai.com/v1/chat/completions use process.env.OPENAI_API_URL + '/v1/chat/completions'
    } catch (error) {
    next(error);
  }
};

export {commentPost};
