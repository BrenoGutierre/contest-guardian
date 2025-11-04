import 'dotenv/config';

export const config = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5500',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '30d'
  },

  resetTokenExpiresMin: parseInt(process.env.RESET_TOKEN_EXPIRES_MIN || '15', 10),

  mail: {
    from: process.env.EMAIL_FROM,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

