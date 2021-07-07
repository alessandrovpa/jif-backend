import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import multer from 'multer';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const userRouter = Router();

userRouter.post(
  '/',
  upload.fields([
    { name: 'portaria', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'document_back', maxCount: 1 },
  ]),
  async (req, res) => {
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
      console.log('AQUI: ', req.files);
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
  },
);

export default userRouter;
