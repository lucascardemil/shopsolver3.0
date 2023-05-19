import { Router } from "express";
import photosController from '../controllers/photos-controller';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: '../../src/assets/photos'
    // uploadDir: '../shopsolver.comercialsupra.cl/assets/photos'
});

class PhotosRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.post('/register', multipartMiddleware, photosController.create);
        this.router.get('/', photosController.all);
        this.router.get('/:id', photosController.searchGroupPhotos);
        this.router.post('/delete', photosController.deletePhoto);
        this.router.post('/update', photosController.updatePhotoGroup);
    }
}

const photosRoutes = new PhotosRoutes();
export default photosRoutes.router;