import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import UpdateUserFilesService from '../services/UpdateUserFilesService';
import UpdateUserPasswordService from '../services/UpdateUserPasswordService';
import ListUserService from '../services/ListUserService';
import FindUserService from '../services/FindUserService';
import multer from 'multer';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

const upload = multer(uploadConfig);

const userRouter = Router();

userRouter.post('/', async (req, res) => {
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
});

userRouter.post(
  '/firstlogin',
  upload.fields([
    { name: 'portaria', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'document_back', maxCount: 1 },
  ]),
  async (req, res) => {
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
  },
);

userRouter.get('/', async (req, res) => {
  const listUser = new ListUserService();
  const findUser = new FindUserService();
  const { user_id } = req.query;
  if (req.user.access > 1) {
    throw new AppError('Permissão negada');
  }
  if (user_id) {
    const user = await findUser.execute(user_id);
    return res.json(user);
  } else {
    const users = await listUser.execute();
    return res.json(users);
  }
});

export default userRouter;
