import express, { Request, Response } from 'express';
import getToken from './controllers/token';
import authenticateToken from './middleware/auth';
import justify from './controllers/justify';
const app = express();

// Middleware pour parser le body des requêtes en JSON
app.use(express.json());

// Importez vos routes ici
app.post('/api/token', getToken);
app.post('/api/justify', authenticateToken, justify);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
