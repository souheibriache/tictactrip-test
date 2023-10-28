import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = ( req: any, res: Response, next: NextFunction) => {
const JWTSecretKey = process.env.JWT_SECRET_KEY as string
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWTSecretKey, (err: any, email : any) => {
    if (err) return res.sendStatus(403);
    req.email = email;
    next();
  });
}
export default authenticateToken