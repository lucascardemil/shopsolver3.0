import { Router } from "express";
import groupsController from '../controllers/groups-controller';


class GroupsRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.post('/register', groupsController.create);
        this.router.delete('/:id', groupsController.delete);
        this.router.get('/', groupsController.all);
        this.router.get('/:id', groupsController.one);
    }
}

const groupsRoutes = new GroupsRoutes();
export default groupsRoutes.router;