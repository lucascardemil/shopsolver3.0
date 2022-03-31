import {Request, Response} from 'express';
import pool from '../database';
const fs = require( 'fs' );

class PhotosController {

    

    public async all (req: Request, res: Response){
        const photos = await pool.query('SELECT * FROM photos');
        res.json(photos);
    }


    public async searchGroupPhotos (req: Request, res: Response){
        const { id } = req.params;
        const photos = await pool.query('SELECT * FROM photos WHERE id_group = ?', [id]);
        if (photos.length > 0){
            const group = await pool.query('SELECT * FROM groups WHERE id = ?', [id]);
            return res.status(200).json({
                status: "ok",
                result:{
                    photos: photos,
                    group: group[0].name
                }
            });
        }else{
            return res.status(200).json({ 
                status: "error",
                result:{
                    message: "No se encuentran fotos"
                } 
            });
        }
    }


    public async create (req: Request, res: Response){
        req.body.url  = req.files;
        const new_url = req.body.url['image']['path'].slice(9);

        const photo = await pool.query('INSERT INTO photos(id_group, price, description, image) VALUES (?,?,?,?)', [req.body.group, req.body.price, req.body.description, new_url]);
        if (photo){
            return res.status(200).json({ 
                status: "ok",
                result:{
                    message: "La foto se subio correctamente"
                } 
            });
        }else{
            return res.status(200).json({ 
                status: "error",
                result:{
                    message: "La foto no se subio"
                } 
            });
            
        }
    }

    public async deletePhoto (req: Request, res: Response){
        req.body.forEach(async (element: any) => {
            fs.unlinkSync( '..\\..\\src' + element.image);
            await pool.query('DELETE FROM photos WHERE id = ?', [element.id]);
        });
        return res.status(200).json({ 
            status: "ok",
            result:{
                message: "Las fotos fueron eliminadas!"
            } 
        });

    }

    public async updatePhotoGroup (req: Request, res: Response){
        req.body.forEach(async (element: any) => {
            await pool.query('UPDATE photos SET id_group = ? WHERE id = ?', [element.id_group, element.id]);
        });
        return res.status(200).json({ 
            status: "ok",
            result:{
                message: "Se actualizo la carpeta!"
            } 
        });
    }

    

    
    
}



const photosController = new PhotosController();
export default photosController;