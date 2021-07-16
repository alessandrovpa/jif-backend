import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import DelegationRepository from '../repositories/DelegationRepository';
import CreateDelegationService from '../services/CreateDelegationService';
import DeleteDelegationService from '../services/DeleteDelegationService';

const delegationRouter = Router();

delegationRouter.get('/', async (req, res) => {
  const delegationRepository = getCustomRepository(DelegationRepository);
  const delegations = await delegationRepository.find();
  return res.json(delegations);
});

delegationRouter.post('/', async (req, res) => {
  if (req.user.access > 0) {
    return res.status(403).json({ error: 'Você não tem permissão para isso!' });
  }

  const { name, abreviation } = req.body;
  const createDelegation = new CreateDelegationService();
  const delegation = await createDelegation.execute({ name, abreviation });
  return res.json(delegation);
});

delegationRouter.delete('/', async (req, res) => {
  const { delegation_id } = req.body;
  const { access } = req.user;
  const deleteDelegation = new DeleteDelegationService();
  const result = await deleteDelegation.execute({ delegation_id, access });
  return res.json({ ok: result });
});

export default delegationRouter;
