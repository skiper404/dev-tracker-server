import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Error validation:', errors.array());
    return res.status(400).json({ error: errors.array() });
  }
  next();
};
