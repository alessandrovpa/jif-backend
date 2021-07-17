import { Router } from 'express';
import AppError from '../errors/AppError';
import CreateModalityService from '../services/CreateModalityService';
import ListModalityService from '../services/ListModalityService';
import DeleteModalityService from '../services/DeleteModalityService';

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

modalityRouter.delete('/', async (req, res) => {
  const deleteModality = new DeleteModalityService();
  const { modality_id } = req.body;
  if (req.user.access > 1) {
    throw new AppError('Permission denied', 401);
  }

  const result = await deleteModality.execute(modality_id);

  return res.json({ ok: result });
});

export default modalityRouter;
