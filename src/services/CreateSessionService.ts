import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import User from '../models/User';
import AppError from '../errors/AppError';
import { classToClass } from 'class-transformer';

interface RequestDTO {
  email: string;
  password: string;
}

class CreateSessionService {
  public async execute({
    email,
    password,
  }: RequestDTO): Promise<{ user: User; token: any }> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(
      { email },
      { relations: ['delegation'] },
    );
    if (!user) {
      throw new AppError('Email e/ou senha incorretos');
    }

    const verifyPassword = await compare(password, user.password);
    if (!verifyPassword) {
      throw new AppError('Email e/ou senha incorretos');
    }

    const token = sign({}, jwtConfig.secret, {
      subject: user.id.toString(),
      expiresIn: jwtConfig.expiresIn,
    });

    return { user: classToClass(user), token };
  }
}

export default CreateSessionService;
