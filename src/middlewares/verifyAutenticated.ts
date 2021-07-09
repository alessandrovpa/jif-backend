import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import { verify } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import AppError from '../errors/AppError';
import { isEqual } from 'date-fns';

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
    const user = await getUser.findOne(sub);
    if (!user) {
      throw new Error('Usuário inexistente');
    }
    console.log(req.route);
    if (
      req.originalUrl != '/user/firstlogin' &&
      isEqual(user.created_at, user.updated_at)
    ) {
      throw new Error('Você deve enviar seus documentos para prosseguir');
    }
    req.user = {
      id: sub,
      access: user.access,
    };
  } catch (err) {
    throw new AppError(err.message, 401);
  }
  next();
}
