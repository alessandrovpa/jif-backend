import { Router } from 'express';
import CreateFunctionService from '../services/CreateFunctionService';
import ListFunctionsService from '../services/ListFunctionsService';
import DeleteFunctionService from '../services/DeleteFunctionService';
import AppError from '../errors/AppError';

const functionRouter = Router();

functionRouter.post('/', async (req, res) => {
  if (req.user.access > 1) {
    throw new AppError('Permission denied', 401);
  }
  const { name, access } = req.body;
  const createFunction = new CreateFunctionService();
  const newFunction = await createFunction.execute({ name, access });

  return res.json(newFunction);
});

functionRouter.get('/', async (req, res) => {
  const { access } = req.user;
  const listFunctions = new ListFunctionsService();
  const functions = await listFunctions.execute(access);

  return res.json(functions);
});

functionRouter.delete('/', async (req, res) => {
  const deleteFunction = new DeleteFunctionService();
  const { function_id } = req.body;
  if (req.user.access > 1) {
    throw new AppError('Permission denied', 401);
  }

  const result = await deleteFunction.execute(function_id);

  return res.json({ ok: result });
});

export default functionRouter;
