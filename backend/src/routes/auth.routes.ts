import { Router } from 'express';
import { AuthController } from '../controllers';

export const createAuthRouter = (authController: AuthController) => {
  const router = Router();
  
  // Auth pages routes
  router.get('/signin', authController.renderSignIn);
  router.get('/signup', authController.renderSignUp);
  
  // Auth API routes
  router.post('/signin', authController.signIn);
  router.post('/signup', authController.signUp);
  router.post('/signout', authController.signOut);
  
  return router;
}; 