import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import fs from 'fs'
const getToken = (req: Request, res: Response) => {
    const JWTSecretKey = process.env.JWT_SECRET_KEY as string
    const { email } = req.body;
    if (!email) {
      res.status(400).send('An email is required');
      return;
    }
    
    // Read the user data from the wordCounts.json file
    let users: { [email: string]: { count: number, timestamp: null | number } } = {};
    try {
      const data = fs.readFileSync('wordCounts.json', 'utf8');
      users = JSON.parse(data);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // Create the file if it doesn't exist
        fs.writeFileSync('wordCounts.json', JSON.stringify(users));
      } else {
        console.error('Error reading wordCounts.json:', err);
      }
    }
  
    // Add the email to the user data if it doesn't exist
    if (!users[email]) {
      users[email] = { count: 0, timestamp: null };
    }
  
    // Update the user data with the count and timestamp
    const user = users[email];
    user.count = 0;
    user.timestamp = null;
  
    // Write the updated user data back to the users.json file
    try {
      fs.writeFileSync('wordCounts.json', JSON.stringify(users));
    } catch (err) {
      console.error('Error writing users.json:', err);
    }
  
    const token = jwt.sign(email, JWTSecretKey);
    res.json({ token });
  };
  

export default getToken;