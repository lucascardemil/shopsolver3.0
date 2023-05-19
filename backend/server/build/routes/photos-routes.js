"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const photos_controller_1 = __importDefault(require("../controllers/photos-controller"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: '../../src/assets/photos'
    // uploadDir: '../shopsolver.comercialsupra.cl/assets/photos'
});
class PhotosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/register', multipartMiddleware, photos_controller_1.default.create);
        this.router.get('/', photos_controller_1.default.all);
        this.router.get('/:id', photos_controller_1.default.searchGroupPhotos);
        this.router.post('/delete', photos_controller_1.default.deletePhoto);
        this.router.post('/update', photos_controller_1.default.updatePhotoGroup);
    }
}
const photosRoutes = new PhotosRoutes();
exports.default = photosRoutes.router;
