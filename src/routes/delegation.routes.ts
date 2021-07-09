import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import DelegationRepository from '../repositories/DelegationRepository';
import CreateDelegationService from '../services/CreateDelegationService';

const delegationRouter = Router();

delegationRouter.get('/', async (req, res) => {
  const delegationRepository = getCustomRepository(DelegationRepository);
  console.log(req.user);
  const delegations = await delegationRepository.find();
  return res.json(delegations);
});

delegationRouter.post('/', async (req, res) => {
  if (req.user.access > 0) {
    console.log('entrou');
    return res.status(403).json({ error: 'Você não tem permissão para isso!' });
  }

  const { name, abreviation } = req.body;
  const createDelegation = new CreateDelegationService();
  const delegation = await createDelegation.execute({ name, abreviation });
  return res.json(delegation);
});

export default delegationRouter;
