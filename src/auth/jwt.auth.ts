import { configDotenv } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

configDotenv();

const secretKey = process.env.SECRET_KEY || '';

export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Authorization token required' });
      return;
    }

    jwt.verify(token, secretKey, (err, decoded: any) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }

      if (decoded.role !== requiredRole) {
        res
          .status(403)
          .json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      req.user = decoded;
      next();
    });
  };
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
