import {Request, Response, NextFunction} from 'express';

const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    try {
      // TODO: Generate a sarcastic, hostile AI response to a Youtube comment, imitating an 18th-century English aristocrat, and return it as a JSON response.
      // Use the text from the request body to generate the response.
      // Instead of using openai library, use fetchData to make a post request to the server.
      // see https://platform.openai.com/docs/api-reference/chat/create for more information
      // You don't need an API key if you use the URL provided in .env.sample and Metropolia VPN
      // Example: instad of https://api.openai.com/v1/chat/completions use process.env.OPENAI_API_URL + '/v1/chat/completions'
    } catch (error) {
    next(error);
  }
};

export {commentPost};
