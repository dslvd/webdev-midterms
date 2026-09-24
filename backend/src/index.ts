import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import incidentRoutes from './routes/incidentRoutes';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

app.listen(PORT, () => {
  console.log(`PulseDesk backend listening at http://localhost:${PORT}`);
});
