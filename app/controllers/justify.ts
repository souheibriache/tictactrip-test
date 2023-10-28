import { Request, Response } from 'express';
import { justifyText } from '../utils/justify-text';
import fs from 'fs'

const justify = (req: any, res: Response) => {
    const wordCount = req.body.text.split(' ').length;
    const email = req.email;
  
    let users: { [email: string]: { count: number, timestamp: null | string } } = {};
    try {
      const data = fs.readFileSync('wordCounts.json', 'utf8');
      users = JSON.parse(data);
    } catch (err) {
      console.error('Error reading wordCounts.json:', err);
    }
  
    const currentDate = new Date();
    const currentDay = currentDate.toISOString().split('T')[0];
  
    if (!users[email] || users[email].timestamp !== currentDay) {
      users[email] = { count: 0, timestamp: currentDay };
    }
  
    if (users[email].count + wordCount <= 1000) {
      users[email].count += wordCount;
  
      try {
        fs.writeFileSync('wordCounts.json', JSON.stringify(users));
      } catch (err) {
        console.error('Error writing wordCounts.json:', err);
      }
  
      console.log(users);
      res.send(justifyText(req.body.text));
    } else {
      res.status(402).send('Payment Required');
    }
  };

export default justify;