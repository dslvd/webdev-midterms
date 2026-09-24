import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import incidentRoutes from './routes/incidentRoutes';
import { initDb } from './db/init';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/services', incidentRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PulseDesk backend listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
