import { Router } from 'express';

import delegationRouter from './delegation.routes';
import userRouter from './user.routes';
import sessionRouter from './session.routes';
import athleteRouter from './athlete.routes';
import modalityRouter from './modality.routes';

import verifyAutenticated from '../middlewares/verifyAutenticated';

const routes = Router();

routes.use('/session', sessionRouter);

routes.use(verifyAutenticated);
routes.use('/athlete', athleteRouter);
routes.use('/user', userRouter);
routes.use('/delegation', delegationRouter);
routes.use('/modality', modalityRouter);

export default routes;
