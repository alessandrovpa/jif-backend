import { Router } from 'express';

import delegationRouter from './delegation.routes';
import userRouter from './user.routes';
import sessionRouter from './session.routes';

import verifyAutenticated from '../middlewares/verifyAutenticated';

const routes = Router();

routes.use('/session', sessionRouter);

routes.use(verifyAutenticated);
routes.use('/delegation', delegationRouter);
routes.use('/user', userRouter);

export default routes;
