import { Router } from 'express';
import { requireAuth } from './auth.js';
import { myResults, createResult } from './results.controller.js';

const r = Router();

r.get('/me', requireAuth, myResults);
r.post('/', requireAuth, createResult);

export default r;

