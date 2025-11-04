import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from './db.js';
import { config } from './config.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, rotateRefreshToken, revokeRefreshToken } from './jwt.js';
import { sendMail } from './mailer.js';

const RegisterDto = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email().optional().nullable()
});

export async function register(req, res) {
  try {
    const { username, password, email } = RegisterDto.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) return res.status(400).json({ message: 'Usuário já existe' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hash, email: email || null }
    });

    if (user.email) {
      const html = welcomeEmailHtml(user.username);
      await sendMail({ to: user.email, subject: '🎖️ Bem-vindo ao Contest Guardian — Gear 5', html });
    }

    return res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    return res.status(400).json({ message: err?.message || 'Falha no cadastro' });
  }
}

const LoginDto = z.object({
  username: z.string(),
  password: z.string()
});

export async function login(req, res) {
  try {
    const { username, password } = LoginDto.parse(req.body);
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

    const accessToken = signAccessToken({ sub: user.id, username: user.username, role: user.role });
    const refreshToken = await signRefreshToken(user.id);

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role }
    });
  } catch {
    return res.status(400).json({ message: 'Falha no login' });
  }
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json({ id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role });
}

const RefreshDto = z.object({ refreshToken: z.string() });

export async function refresh(req, res) {
  try {
    const { refreshToken } = RefreshDto.parse(req.body);
    const dbTok = await verifyRefreshToken(refreshToken);
    if (!dbTok) return res.status(401).json({ message: 'Refresh inválido' });
    const user = await prisma.user.findUnique({ where: { id: dbTok.userId } });
    if (!user) return res.status(401).json({ message: 'Usuário inválido' });

    const accessToken = signAccessToken({ sub: user.id, username: user.username, role: user.role });
    return res.json({ accessToken });
  } catch {
    return res.status(400).json({ message: 'Falha no refresh' });
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = RefreshDto.parse(req.body);
    await revokeRefreshToken(refreshToken);
    return res.json({ message: 'Logout ok' });
  } catch {
    return res.status(400).json({ message: 'Falha no logout' });
  }
}

const RecoverDto = z.object({ email: z.string().email() });

export async function recover(req, res) {
  try {
    const { email } = RecoverDto.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: 'Se existir conta, enviaremos o e-mail.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + config.resetTokenExpiresMin * 60 * 1000);
    await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });

    const link = `${config.clientUrl.replace(/\/$/, '')}/reset.html?token=${token}`;
    const html = resetEmailHtml(link, config.resetTokenExpiresMin);
    await sendMail({ to: email, subject: 'Redefinir senha — Contest Guardian', html });

    return res.json({ message: 'Se existir conta, enviaremos o e-mail.' });
  } catch {
    return res.status(400).json({ message: 'Falha ao iniciar recuperação' });
  }
}

const ResetDto = z.object({ token: z.string(), password: z.string().min(6) });

export async function reset(req, res) {
  try {
    const { token, password } = ResetDto.parse(req.body);
    const entry = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!entry || entry.expiresAt < new Date()) return res.status(400).json({ message: 'Token inválido ou expirado' });

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: entry.userId }, data: { password: hash } });
    await prisma.passwordResetToken.delete({ where: { token } });

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch {
    return res.status(400).json({ message: 'Falha ao redefinir senha' });
  }
}

function resetEmailHtml(link, minutes) {
  return `
  <div style="font-family:Segoe UI,Arial">
    <h2 style="color:#0fa968">Contest Guardian — Recuperar Senha</h2>
    <p>Use o botão abaixo para redefinir sua senha (expira em ${minutes} minutos):</p>
    <p><a href="${link}" style="background:#10b981;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Redefinir Senha</a></p>
  </div>`;
}

function welcomeEmailHtml(username) {
  return `
  <div style="font-family:Segoe UI,Arial">
    <h2 style="color:#0fa968">Bem-vindo, ${username}!</h2>
    <p>Você entrou para o Contest Guardian — Gear 5. Bons estudos!</p>
  </div>`;
}
