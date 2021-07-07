import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const userRouter = Router();

userRouter.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      siape,
      contact,
      portaria,
      document,
      document_back,
      access,
      delegation_id,
    } = req.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      email,
      siape,
      contact,
      portaria,
      document,
      document_back,
      access,
      delegation_id,
    });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default userRouter;
