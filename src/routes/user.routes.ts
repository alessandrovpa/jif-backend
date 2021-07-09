import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import UpdateUserFilesService from '../services/UpdateUserFilesService';
import UpdateUserPasswordService from '../services/UpdateUserPasswordService';
import multer from 'multer';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const userRouter = Router();

userRouter.post('/', async (req, res) => {
  try {
    const { name, email, siape, contact, access, delegation_id } = req.body;

    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      email,
      siape,
      contact,
      access,
      delegation_id,
    });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

userRouter.post(
  '/firstlogin',
  upload.fields([
    { name: 'portaria', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'document_back', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateUserFiles = new UpdateUserFilesService();

      const portaria = req.files.portaria[0].filename;
      const document = req.files.document[0].filename;
      const document_back = req.files.document_back[0].filename;

      const user_id = req.user.id;

      await updateUserFiles.execute({
        portaria,
        document,
        document_back,
        user_id,
      });

      const updatePassword = new UpdateUserPasswordService();
      const { old_password, new_password, confirm_password } = req.body;
      const user = await updatePassword.execute({
        old_password,
        new_password,
        confirm_password,
        user_id: req.user.id,
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

export default userRouter;
