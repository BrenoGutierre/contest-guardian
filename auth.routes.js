import { Router } from 'express';
import { register, login, me, refresh, logout, recover, reset } from './auth.controller.js';
import { requireAuth } from './auth.js';

const r = Router();

r.post('/register', register);
r.post('/login', login);
r.post('/refresh', refresh);
r.post('/logout', logout);
r.get('/me', requireAuth, me);
r.post('/recover', recover);
r.post('/reset', reset);

export default r;

