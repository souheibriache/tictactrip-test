import { Request, Response } from 'express';
import { justifyText } from '../utils/justify-text';
const wordCounts: { [email: string]: number } = {};

const justify = (req: any, res: Response) => {
  const wordCount = req.body.text.split(' ').length;
    console.log(req.email, !wordCounts[req.email], wordCounts[req.email], wordCount )
  if (!wordCounts[req.email] || wordCounts[req.email] + wordCount <= 1000) {
    wordCounts[req.email] = (wordCounts[req.email] || 0) + wordCount;
    res.send(justifyText(req.body.text));
  } else {
    res.status(402).send('Payment Required');
  }
}

export default justify;