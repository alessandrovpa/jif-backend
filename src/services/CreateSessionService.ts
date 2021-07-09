import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import User from '../models/User';
import AppError from '../errors/AppError';

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
    const user = await userRepository.findOne({ email });
    if (!user) {
      throw new AppError('Email e/ou senha incorretos');
    }

    const verifyPassword = await compare(password, user.password);
    if (!verifyPassword) {
      throw new AppError('Email e/ou senha incorretos');
    }

    delete user.password;
    delete user.contact;
    delete user.portaria;
    delete user.document;
    delete user.document_back;

    const token = sign({}, jwtConfig.secret, {
      subject: user.id,
      expiresIn: jwtConfig.expiresIn,
    });

    return { user, token };
  }
}

export default CreateSessionService;
