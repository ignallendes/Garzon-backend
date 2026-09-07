import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRA = process.env.JWT_EXPIRA 