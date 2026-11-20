
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Generate JWT
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET!,
    { expiresIn: '1h' }
  );
};

// Verify JWT
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      message: 'Authentication token is required',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.userId !== 'string'
    ) {
      return res.status(403).json({
        message: 'Invalid or expired token',
      });
    }

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(403).json({
      message: 'Invalid or expired token',
    });
  }
};
