import express, { Request, Response } from 'express';
import getToken from './controllers/token';
import authenticateToken from './middleware/auth';
import justify from './controllers/justify';
import helmet from 'helmet';
import fs from 'fs'
import path from 'path'
const morgan = require('morgan')

const app = express();


// Middleware to parse the request body into json
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'))

// Routes
app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname,'layouts/index.html'))
})
app.post('/api/token', getToken);
app.post('/api/justify', authenticateToken, justify);

// Create the data storage file if it doesn't exist
if (!fs.existsSync('wordCounts.json')) {
    fs.writeFileSync('wordCounts.json', JSON.stringify({}));
  }

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
