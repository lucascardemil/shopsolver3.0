import { Request, Response } from 'express';
import pool from '../database';
const fs = require('fs');

class GroupsController {

    public async all(req: Request, res: Response) {
        const groups = await pool.query('SELECT * FROM groups_shopsolver');
        res.json(groups);
    }

    public async one(req: Request, res: Response) {
        const { id } = req.params;
        const group = await pool.query('SELECT * FROM groups_shopsolver WHERE id = ?', [id]);
        if (group.length > 0) {
            return res.status(200).json(group[0]);
        } else {
            return res.status(200).json({
                status: "error",
                result: {
                    message: "La carpeta no existe"
                }
            });
        }
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;

        const images = await pool.query('SELECT * FROM photos_shopsolver WHERE id_group = ?', [id]);

        if (images.length > 0) {
            images.forEach(async (element: any) => {
                const filePath = '..\\..\\src' + element.image;

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                // fs.unlinkSync('..\\..\\src' + element.image);
                const groups = await pool.query('DELETE FROM photos_shopsolver WHERE id = ?', [element.id]);
                if (groups) {
                    return res.status(200).json({
                        status: "ok",
                        result: {
                            message: "La carpeta fue eliminada!"
                        }
                    });
                } else {
                    return res.status(200).json({
                        status: "error",
                        result: {
                            message: "La carpeta no se elimino!"
                        }
                    });

                }
            });
        }

        const groups = await pool.query('DELETE FROM groups_shopsolver WHERE id = ?', [id]);
        if (groups) {
            return res.status(200).json({
                status: "ok",
                result: {
                    message: "La carpeta fue eliminada!"
                }
            });
        } else {
            return res.status(200).json({
                status: "error",
                result: {
                    message: "La carpeta no se elimino!"
                }
            });

        }
    }


    public async create(req: Request, res: Response) {

        const { name } = req.body;

        if (name == "") {
            return res.status(200).json({
                status: "error",
                result: {
                    message: "El nombre es requerido"
                }
            });
        } else {
            const groups = await pool.query('INSERT INTO groups_shopsolver set ?', [req.body]);
            if (groups) {
                return res.status(200).json({
                    status: "ok",
                    result: {
                        message: "La carpeta se creo correctamente"
                    }
                });
            } else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La carpeta no se pudo crear"
                    }
                });

            }
        }
    }
}

const groupsController = new GroupsController();
export default groupsController;