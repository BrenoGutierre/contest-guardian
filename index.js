import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';

import authRoutes from './auth.routes.js';
import examsRoutes from './exams.routes.js';
import resultsRoutes from './results.routes.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());

app.use(cors({
  origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: false
}));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/exams', examsRoutes);
app.use('/results', resultsRoutes);

app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

app.listen(config.port, () => {
  console.log(`✅ API rodando em http://localhost:${config.port}`);
});

