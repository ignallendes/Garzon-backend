import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_fallback_barmonitor_12345';
export const JWT_EXPIRA = process.env.JWT_EXPIRA || '12h';