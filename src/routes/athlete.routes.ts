import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import CreateAthleteService from '../services/CreateAthleteService';
import UpdateAthleteFilesService from '../services/UpdateAthleteFilesService';
import ListAthleteService from '../services/ListAthleteService';
import FindAthleteService from '../services/FindAthleteService';
import UpdateAthleteStatusService from '../services/UpdateAthleteStatusService';
import DeleteAthleteService from '../services/DeleteAthleteService';
import UpdateAthleteService from '../services/UpdateAthleteService';
import ListAthleteByDelegationAndModalityService from '../services/ListAthleteByDelegationAndModalityService';

const upload = multer(uploadConfig);

const athleteRouter = Router();

athleteRouter.post('/', async (req, res) => {
  const createAthlete = new CreateAthleteService();
  const { delegation_id } = req.user;
  const {
    name,
    email,
    birth,
    identity,
    genre,
    contact,
    nickname,
    game_id,
    modalities,
  } = req.body;

  const athlete = await createAthlete.execute({
    name,
    email,
    birth,
    identity,
    genre,
    contact,
    nickname,
    game_id,
    modalities,
    delegation_id,
  });

  return res.json(athlete);
});

athleteRouter.post(
  '/files',
  upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'document_back', maxCount: 1 },
    { name: 'authorization', maxCount: 1 },
  ]),
  async (req, res) => {
    const { athlete_id } = req.body;
    const { delegation_id } = req.user;

    let picture;
    if (req.files.picture) {
      picture = req.files.picture[0].filename;
    }

    let document;
    if (req.files.document) {
      document = req.files.document[0].filename;
    }

    let document_back;
    if (req.files.document_back) {
      document_back = req.files.document_back[0].filename;
    }

    let authorization;
    if (req.files.authorization) {
      authorization = req.files.authorization[0].filename;
    }

    const updateAthleteFile = new UpdateAthleteFilesService();
    const athlete = await updateAthleteFile.execute({
      athlete_id,
      delegation_id,
      picture,
      document,
      document_back,
      authorization,
    });
    return res.json(athlete);
  },
);

athleteRouter.get('/', async (req, res) => {
  const listAthletes = new ListAthleteService();
  const findAthlete = new FindAthleteService();
  const listAthletesByDelegationAndModality =
    new ListAthleteByDelegationAndModalityService();
  let { delegation_id, athlete_id, modality_id } = req.query;

  if (athlete_id) {
    const athlete = await findAthlete.execute(athlete_id);
    if (
      req.user.access > 1 &&
      athlete.delegation_id != req.user.delegation_id
    ) {
      throw new AppError('Não autorizado');
    } else return res.json(athlete);
  }
  if (modality_id) {
    if (req.user.access > 1) {
      throw new AppError('Permission denied');
    }
    const athletes = await listAthletesByDelegationAndModality.execute({
      delegation_id,
      modality_id,
    });
    return res.json(athletes);
  }
  if (delegation_id) {
    if (req.user.access > 1) {
      throw new AppError('Você não pode listar atletas de outras delegações');
    }
  } else {
    delegation_id = req.user.delegation_id;
  }

  const athletes = await listAthletes.execute(delegation_id);

  return res.json(athletes);
});

athleteRouter.put('/:athlete_id/status', async (req, res) => {
  if (req.user.access > 1) {
    throw new AppError('Você não tem permissão para homologar inscrições!');
  }
  const updateAthleteStatus = new UpdateAthleteStatusService();
  const { athlete_id } = req.params;
  const { status, observation } = req.body;

  const athlete = await updateAthleteStatus.execute({
    athlete_id,
    status,
    observation,
  });

  return res.json(athlete);
});

athleteRouter.delete('/', async (req, res) => {
  const { athlete_id } = req.body;
  const { access, delegation_id } = req.user;
  const deleteAthlete = new DeleteAthleteService();
  const result = await deleteAthlete.execute({
    athlete_id,
    access,
    delegation_id,
  });
  return res.json({ ok: result });
});

athleteRouter.post('/:id/update', async (req, res) => {
  const updateAthlete = new UpdateAthleteService();
  const { id } = req.params;
  const {
    name,
    email,
    birth,
    identity,
    genre,
    contact,
    nickname,
    game_id,
    modalities,
  } = req.body;

  const athlete = await updateAthlete.execute({
    id,
    name,
    email,
    birth,
    identity,
    genre,
    contact,
    nickname,
    game_id,
    modalities,
  });

  return res.json(athlete);
});

export default athleteRouter;
