import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const getToken = (req: Request, res: Response) => {
  const { userInput } = req.body;
  if(!userInput  || !userInput.email) {
    res.status(400).send('En email is required');
  }
  console.log(userInput.email)
  const token = jwt.sign(userInput.email, 'test123');
  res.json({ token });
}

export default getToken;