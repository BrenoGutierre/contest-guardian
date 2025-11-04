import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { prisma } from './db.js';
import crypto from 'crypto';

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpires });
}

export async function signRefreshToken(userId) {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + parseDuration(config.jwt.refreshExpires));
  await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
}

export async function revokeRefreshToken(token) {
  await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
}

export async function rotateRefreshToken(oldToken, userId) {
  await revokeRefreshToken(oldToken);
  return signRefreshToken(userId);
}

export async function verifyRefreshToken(token) {
  const dbTok = await prisma.refreshToken.findUnique({ where: { token } });
  if (!dbTok || dbTok.revoked || dbTok.expiresAt < new Date()) return null;
  return dbTok;
}

function parseDuration(str) {
  const m = /^(\d+)([smhd])$/.exec(str);
  const n = parseInt(m?.[1] || '0', 10);
  const u = m?.[2] || 's';
  const map = { s: 1, m: 60, h: 3600, d: 86400 };
  return n * map[u] * 1000;
}

