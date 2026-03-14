import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({
      message: 'User not authorized'
    });
    return;
  }

  next();
};