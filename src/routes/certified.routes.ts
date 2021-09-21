import { Router } from 'express';
import GetAthelteCertifiedService from '../services/GetAthleteCertifiedService';
import AppError from '../errors/AppError';

const certifiedRouter = Router();

certifiedRouter.get('/', async (req, res) => {
  const { email } = req.query;
  const getCertified = new GetAthelteCertifiedService();
  if (!email) {
    throw new AppError('Email obrigatório');
  }
  const certified = await getCertified.execute(email.toString());

  return res.json({ url: certified });
});

export default certifiedRouter;
