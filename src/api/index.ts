import express from 'express';

import commentRoute from './routes/commentRoute';
import dishRoute from './routes/dishRoute';

import {MessageResponse} from '../types/MessageTypes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'routes: comments, dishes',
  });
});

router.use('/comments', commentRoute);
router.use('/dishes', dishRoute);

export default router;