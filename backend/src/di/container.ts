import { 
  FileTodoRepository, 
  FileUserRepository, 
  ITodoRepository, 
  IUserRepository 
} from '../repositories';

import { 
  TodoService, 
  UserService, 
  AuthService 
} from '../services';

import { 
  TodoController, 
  AuthController,
  LanguageController
} from '../controllers';

interface Container {
  // Repositories
  todoRepository: ITodoRepository;
  userRepository: IUserRepository;
  
  // Services
  todoService: TodoService;
  userService: UserService;
  authService: AuthService;
  
  // Controllers
  todoController: TodoController;
  authController: AuthController;
  languageController: LanguageController;
}

// Initialize all dependencies and wire them together
export function createContainer(): Container {
  // Repositories
  const todoRepository = new FileTodoRepository();
  const userRepository = new FileUserRepository();
  
  // Services
  const todoService = new TodoService(todoRepository);
  const userService = new UserService(userRepository);
  const authService = new AuthService(userService);
  
  // Controllers
  const todoController = new TodoController(todoService);
  const authController = new AuthController(authService);
  const languageController = new LanguageController(userService);
  
  return {
    // Repositories
    todoRepository,
    userRepository,
    
    // Services
    todoService,
    userService,
    authService,
    
    // Controllers
    todoController,
    authController,
    languageController
  };
} 