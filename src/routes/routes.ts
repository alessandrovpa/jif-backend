import { Router } from 'express';

import delegationRouter from './delegation.routes';
import userRouter from './user.routes';
import sessionRouter from './session.routes';
import athleteRouter from './athlete.routes';
import modalityRouter from './modality.routes';
import functionRouter from './function.routes';

import CreateDefaultADMUser from '../services/CreateDefaultADMUser';

import verifyAutenticated from '../middlewares/verifyAutenticated';

const routes = Router();

routes.use('/session', sessionRouter);
routes.get('/user/admin', async (req, res) => {
  const createADM = new CreateDefaultADMUser();
  const user = await createADM.execute();
  return res.json({ email: user.email });
});

routes.use(verifyAutenticated);
routes.use('/athlete', athleteRouter);
routes.use('/user', userRouter);
routes.use('/delegation', delegationRouter);
routes.use('/modality', modalityRouter);
routes.use('/function', functionRouter);

export default routes;
