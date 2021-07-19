import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import { verify } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import AppError from '../errors/AppError';
import { compare } from 'bcryptjs';

interface TokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export default async function verifyAutenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;

  if (!header) {
    throw new AppError('Missing JWT Token', 401);
  }

  const [, token] = header.split(' ');

  try {
    const decoded = verify(token, jwtConfig.secret);
    const { sub } = decoded as TokenPayload;
    const getUser = getRepository(User);
    const user = await getUser.findOne(sub, {
      select: ['id', 'access', 'delegation_id'],
    });
    if (!user) {
      throw new Error('Usuário inexistente');
    }
    const verifyPassword = await compare('123456', user.password);
    if (req.originalUrl != '/user/firstlogin' && verifyPassword) {
      throw new Error('Você deve enviar seus documentos para prosseguir');
    }
    req.user = {
      id: sub,
      access: user.access,
      delegation_id: user.delegation_id,
    };
  } catch (err) {
    throw new AppError(err.message, 401);
  }
  next();
}
