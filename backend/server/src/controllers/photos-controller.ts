import { Request, Response } from 'express';
import pool from '../database';
const fs = require('fs');

class PhotosController {

    public async all(req: Request, res: Response) {
        const photos = await pool.query(`SELECT * FROM products`);
        res.json(photos);
    }


    public async searchGroupPhotos(req: Request, res: Response) {
        const { id } = req.params;
        const photos = await pool.query('SELECT * FROM products INNER JOIN photos_shopsolver ON products.id = photos_shopsolver.id_product WHERE photos_shopsolver.id_group = ?', [id]);
        if (photos.length > 0) {
            const group = await pool.query('SELECT * FROM groups_shopsolver WHERE id = ?', [id]);
            return res.status(200).json({
                status: "ok",
                result: {
                    photos: photos,
                    group: group[0].name
                }
            });
        } else {
            return res.status(200).json({
                status: "error",
                result: {
                    message: "No se encuentran fotos"
                }
            });
        }
    }


    public async create(req: Request, res: Response) {
        req.body.url = req.files;
        const new_url = req.body.url['image']['path'].slice(9);

        // const cut_url = req.body.url['image']['path'].slice(3);
        // const new_url = 'http://' + cut_url;

        const photos = await pool.query('SELECT * FROM photos_shopsolver WHERE id = ?', [req.body.id]);
        if (photos.length > 0) {
            const filePath = '..\\..\\src' + photos[0].image;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // const filePath = '../' + photos[0].image.slice(7);
            // fs.unlinkSync(filePath);

            const photo = await pool.query('UPDATE photos_shopsolver SET id_group = ?, price = ?, description = ?, image = ? WHERE id = ?', [req.body.group, req.body.price, req.body.description, new_url, req.body.id]);
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
            } else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La informacion no se actualizo"
                    }
                });

            }
        } else {
            const photo = await pool.query('INSERT INTO photos_shopsolver(id_product, id_group, price, description, image) VALUES (?,?,?,?,?)', [req.body.id, req.body.group, req.body.price, req.body.description, new_url]);
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
            } else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La foto no se subio"
                    }
                });

            }
        }
    }

    public async deletePhoto(req: Request, res: Response) {

        req.body.forEach(async (element: any) => {
            const filePath = '..\\..\\src' + element.image;

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // const cut_url = element.image.slice(7);
            // const new_url = '../' + cut_url;
            // fs.unlinkSync(new_url);

            await pool.query('DELETE FROM photos_shopsolver WHERE id = ?', [element.id]);
        });
        return res.status(200).json({
            status: "ok",
            result: {
                message: "Las fotos fueron eliminadas!",
                product: req.body
            }
        });

    }

    public async updatePhotoGroup(req: Request, res: Response) {
        req.body.forEach(async (element: any) => {
            await pool.query('UPDATE photos_shopsolver SET id_group = ? WHERE id = ?', [element.id_group, element.id]);
        });
        return res.status(200).json({
            status: "ok",
            result: {
                message: "Se actualizo la carpeta!",
                product: req.body
            }
        });
    }
}



const photosController = new PhotosController();
export default photosController;