import { Router } from 'express';
import AppError from '../errors/AppError';
import CreateModalityService from '../services/CreateModalityService';
import ListModalityService from '../services/ListModalityService';

const modalityRouter = Router();

modalityRouter.post('/', async (req, res) => {
  const { name, genre, holder, backup } = req.body;
  if (req.user.access > 1) {
    throw new AppError('Você não pode criar modalidades', 401);
  }
  const createModality = new CreateModalityService();
  const modality = await createModality.execute({
    name,
    genre,
    holder,
    backup,
  });
  return res.json(modality);
});

modalityRouter.get('/', async (req, res) => {
  const { genre } = req.query;
  const listModality = new ListModalityService();

  const modalities = await listModality.execute(genre);

  return res.json(modalities);
});

export default modalityRouter;
