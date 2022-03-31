import { Router } from "express";
import usersController from '../controllers/users-controller';

class UsersRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', usersController.all);
        this.router.get('/:id', usersController.one);
        this.router.post('/login', usersController.login);
        this.router.post('/register', usersController.create);
        this.router.delete('/:id', usersController.delete);
        this.router.put('/:id', usersController.update);
    }
}

const usersRoutes = new UsersRoutes();
export default usersRoutes.router;