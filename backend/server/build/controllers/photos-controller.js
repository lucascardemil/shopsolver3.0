"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const fs = require('fs');
class PhotosController {
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const photos = yield database_1.default.query('SELECT * FROM photos');
            res.json(photos);
        });
    }
    searchGroupPhotos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const photos = yield database_1.default.query('SELECT * FROM photos WHERE id_group = ?', [id]);
            if (photos.length > 0) {
                const group = yield database_1.default.query('SELECT * FROM groups WHERE id = ?', [id]);
                return res.status(200).json({
                    status: "ok",
                    result: {
                        photos: photos,
                        group: group[0].name
                    }
                });
            }
            else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "No se encuentran fotos"
                    }
                });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.url = req.files;
            const new_url = req.body.url['image']['path'].slice(9);
            const photo = yield database_1.default.query('INSERT INTO photos(id_group, price, description, image) VALUES (?,?,?,?)', [req.body.group, req.body.price, req.body.description, new_url]);
            if (photo) {
                return res.status(200).json({
                    status: "ok",
                    result: {
                        message: "La foto se subio correctamente"
                    }
                });
            }
            else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La foto no se subio"
                    }
                });
            }
        });
    }
    deletePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                fs.unlinkSync('..\\..\\src' + element.image);
                yield database_1.default.query('DELETE FROM photos WHERE id = ?', [element.id]);
            }));
            return res.status(200).json({
                status: "ok",
                result: {
                    message: "Las fotos fueron eliminadas!"
                }
            });
        });
    }
    updatePhotoGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                yield database_1.default.query('UPDATE photos SET id_group = ? WHERE id = ?', [element.id_group, element.id]);
            }));
            return res.status(200).json({
                status: "ok",
                result: {
                    message: "Se actualizo la carpeta!"
                }
            });
        });
    }
}
const photosController = new PhotosController();
exports.default = photosController;
