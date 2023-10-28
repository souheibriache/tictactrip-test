import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = ( req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, 'test123', (err: any, email : any) => {
    if (err) return res.sendStatus(403);
    req.email = email;
    next();
  });
}
export default authenticateToken