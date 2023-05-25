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
            const photos = yield database_1.default.query(`SELECT
                                            products.id AS id,
                                            products.name AS name,
                                            products.detail AS detail,
                                            products.enabled AS enabled,
                                            CASE WHEN photos_shopsolver.image IS NULL THEN false ELSE true END AS has_image
                                        FROM
                                            products
                                        LEFT JOIN photos_shopsolver ON products.id = photos_shopsolver.id_product`);
            res.json(photos);
        });
    }
    searchGroupPhotos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const photos = yield database_1.default.query(`SELECT
                                            
                                            products.detail AS detail,
                                            products.enabled AS enabled,
                                            CASE WHEN photos_shopsolver.image IS NULL THEN false ELSE true END AS has_image,
                                            photos_shopsolver.id AS id,
                                            photos_shopsolver.id_product AS id_product,
                                            photos_shopsolver.id_group AS id_group,
                                            photos_shopsolver.price AS price,
                                            photos_shopsolver.description AS description,
                                            photos_shopsolver.image AS image
                                        FROM
                                            products
                                        LEFT JOIN photos_shopsolver ON products.id = photos_shopsolver.id_product WHERE photos_shopsolver.id_group = ?`, [id]);
            if (photos.length > 0) {
                const group = yield database_1.default.query('SELECT * FROM groups_shopsolver WHERE id = ?', [id]);
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
            // const cut_url = req.body.url['image']['path'].slice(3);
            // const new_url = 'http://' + cut_url;
            const photos = yield database_1.default.query('SELECT * FROM photos_shopsolver WHERE id = ?', [req.body.id]);
            if (photos.length > 0) {
                const filePath = '..\\..\\src' + photos[0].image;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                // const filePath = '../' + photos[0].image.slice(7);
                // fs.unlinkSync(filePath);
                const photo = yield database_1.default.query('UPDATE photos_shopsolver SET id_group = ?, price = ?, description = ?, image = ? WHERE id = ?', [req.body.group, req.body.price, req.body.description, new_url, req.body.id]);
                if (photo) {
                    return res.status(200).json({
                        status: "ok",
                        result: {
                            message: "La informacion se actualizo correctamente",
                            product: {
                                id: req.body.id,
                                id_group: req.body.group,
                                image: new_url,
                                price: req.body.price,
                                description: req.body.description
                            }
                        }
                    });
                }
                else {
                    return res.status(200).json({
                        status: "error",
                        result: {
                            message: "La informacion no se actualizo"
                        }
                    });
                }
            }
            else {
                const photo = yield database_1.default.query('INSERT INTO photos_shopsolver(id_product, id_group, price, description, image) VALUES (?,?,?,?,?)', [req.body.id, req.body.group, req.body.price, req.body.description, new_url]);
                if (photo) {
                    return res.status(200).json({
                        status: "ok",
                        result: {
                            message: "La foto se subio correctamente",
                            product: {
                                id: req.body.id,
                                id_group: req.body.group,
                                image: new_url,
                                price: req.body.price,
                                description: req.body.description
                            }
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
            }
        });
    }
    deletePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                const filePath = '..\\..\\src' + element.image;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                // const cut_url = element.image.slice(7);
                // const new_url = '../' + cut_url;
                // fs.unlinkSync(new_url);
                yield database_1.default.query('DELETE FROM photos_shopsolver WHERE id = ?', [element.id]);
            }));
            return res.status(200).json({
                status: "ok",
                result: {
                    message: "Las fotos fueron eliminadas!",
                    product: req.body
                }
            });
        });
    }
    updatePhotoGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                yield database_1.default.query('UPDATE photos_shopsolver SET id_group = ? WHERE id = ?', [element.id_group, element.id]);
            }));
            return res.status(200).json({
                status: "ok",
                result: {
                    message: "Se actualizo la carpeta!",
                    product: req.body
                }
            });
        });
    }
}
const photosController = new PhotosController();
exports.default = photosController;
