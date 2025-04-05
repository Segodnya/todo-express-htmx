import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { Request, Response } from 'express';

const router = Router();
const authController = new AuthController();

// Auth routes
router.post('/signup', (req, res, next) =>
  authController.signup(req, res, next)
);
router.post('/signin', (req, res, next) =>
  authController.signin(req, res, next)
);
router.post('/signout', (req, res, next) =>
  authController.signout(req, res, next)
);

// Auth pages routes
router.get('/signup', (req: Request, res: Response) => {
  if (req.session.user) {
    return res.redirect('/todos');
  }
  res.render('auth/signup');
});

router.get('/signin', (req: Request, res: Response) => {
  if (req.session.user) {
    return res.redirect('/todos');
  }
  res.render('auth/signin');
});

export default router;
