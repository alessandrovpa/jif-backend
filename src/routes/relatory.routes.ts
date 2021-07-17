import { Router } from 'express';

import CreateAthleteRelatoryService from '../services/CreateAthleteRelatoryService';

const relatoryRouter = Router();

relatoryRouter.get('/athletes', async (req, res) => {
  const { delegation_id } = req.user;
  const athleteRelatory = new CreateAthleteRelatoryService();
  const { aprovados, reprovados, total } = await athleteRelatory.execute(
    delegation_id,
  );
  return res.json({
    aprovados,
    reprovados,
    total,
  });
});

export default relatoryRouter;
