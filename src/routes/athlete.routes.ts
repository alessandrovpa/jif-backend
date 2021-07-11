import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import CreateAthleteService from '../services/CreateAthleteService';
import UpdateAthleteFilesService from '../services/UpdateAthleteFilesService';
import ListAthleteService from '../services/ListAthleteService';
import FindAthleteService from '../services/FindAthleteService';

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

    const picture = req.files.picture[0].filename;
    const document = req.files.document[0].filename;
    const document_back = req.files.document_back[0].filename;
    const authorization = req.files.authorization[0].filename;

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
  let { delegation_id, athlete_id } = req.query;

  if (athlete_id) {
    const athlete = await findAthlete.execute(athlete_id);
    if (
      req.user.access > 1 &&
      athlete.delegation_id != req.user.delegation_id
    ) {
      throw new AppError('Não autorizado');
    } else return res.json(athlete);
  }
  if (delegation_id) {
    if (req.user.access > 1) {
      throw new AppError('Você não pode listar outras delegações');
    }
  } else {
    delegation_id = req.user.delegation_id;
  }

  const athletes = await listAthletes.execute(delegation_id);

  return res.json(athletes);
});

export default athleteRouter;
