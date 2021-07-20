import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';
import UpdateUserFilesService from '../services/UpdateUserFilesService';
import UpdateUserPasswordService from '../services/UpdateUserPasswordService';
import ListUserService from '../services/ListUserService';
import FindUserService from '../services/FindUserService';
import GetUserAccessService from '../services/GetUserAcessService';
import DeleteUserService from '../services/DeleteUserService';
import multer from 'multer';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

const upload = multer(uploadConfig);

const userRouter = Router();

userRouter.post('/', async (req, res) => {
  const { name, email, siape, contact, function_id } = req.body;
  const { access } = req.user;
  let delegation_id;
  if (access > 1) {
    delegation_id = req.user.delegation_id;
  } else {
    delegation_id = req.body.delegation_id;
  }

  const createUser = new CreateUserService();
  const user = await createUser.execute({
    name,
    email,
    siape,
    contact,
    delegation_id,
    function_id,
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
  if (user_id) {
    if (req.user.access > 1 && req.user.id != user_id) {
      throw new AppError('Permissão negada');
    }
    const user = await findUser.execute(user_id);
    return res.json(user);
  } else {
    const { delegation_id, access } = req.user;
    const users = await listUser.execute({ delegation_id, access });
    return res.json(users);
  }
});

userRouter.get('/access', async (req, res) => {
  const { id } = req.user;
  const getUserAcess = new GetUserAccessService();
  const access = await getUserAcess.execute(id);

  return res.json(access);
});

userRouter.delete('/', async (req, res) => {
  const { user_id } = req.body;
  const { access, id } = req.user;
  if (user_id === id) {
    throw new AppError('Você não pode se apagar');
  }
  const deleteUser = new DeleteUserService();
  const result = await deleteUser.execute({ user_id, access });
  return res.json({ ok: result });
});

export default userRouter;
