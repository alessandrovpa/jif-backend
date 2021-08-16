import { Router } from 'express';
import AppError from '../errors/AppError';

import CreateAthleteRelatoryService from '../services/CreateAthleteRelatoryService';
import CreateModalityRelatoryService from '../services/CreateModalityRelatoryService';

const relatoryRouter = Router();

relatoryRouter.get('/athletes', async (req, res) => {
  const { delegation_id, access } = req.user;
  const athleteRelatory = new CreateAthleteRelatoryService();
  const { aprovados, reprovados, total } = await athleteRelatory.execute({
    delegation_id,
    access,
  });
  return res.json({
    aprovados,
    reprovados,
    total,
  });
});

relatoryRouter.get('/modalities', async (req, res) => {
  const { access } = req.user;
  if (access > 1) {
    throw new AppError('Permission denied', 401);
  }
  const modalitiesRelatory = new CreateModalityRelatoryService();
  const relatory = await modalitiesRelatory.execute();
  return res.json(relatory);
});

export default relatoryRouter;
