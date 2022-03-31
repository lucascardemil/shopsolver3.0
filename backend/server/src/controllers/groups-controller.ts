import {Request, Response} from 'express';
import pool from '../database';

class GroupsController {

    public async all (req: Request, res: Response){
        const groups = await pool.query('SELECT * FROM groups');
        res.json(groups);
    }

    public async one (req: Request, res: Response){
        const { id } = req.params;
        const group = await pool.query('SELECT * FROM groups WHERE id = ?', [id]);
        if (group.length > 0){
            return res.status(200).json(group[0]);
        }else{
            return res.status(200).json({ 
                status: "error",
                result:{
                    message: "La carpeta no existe"
                } 
            });
        }
    }

    public async delete (req: Request, res: Response){
        const { id } = req.params;
        const groups = await pool.query('DELETE FROM groups WHERE id = ?', [id]);
        if (groups){
            return res.status(200).json({ 
                status: "ok",
                result:{
                    message: "La carpeta fue eliminado"
                } 
            });
        }else{
            return res.status(200).json({ 
                status: "error",
                result:{
                    message: "La carpeta no se elimino"
                } 
            });
            
        }
    }


    public async create (req: Request, res: Response){

        const { name } = req.body;

        if(name == "") {
            return res.status(200).json({
                status: "error",
                result:{
                    message: "El nombre es requerido"
                }
            });
        }else{
            const groups = await pool.query('INSERT INTO groups set ?', [req.body]);
            if (groups){
                return res.status(200).json({ 
                    status: "ok",
                    result:{
                        message: "La carpeta se creo correctamente"
                    } 
                });
            }else{
                return res.status(200).json({ 
                    status: "error",
                    result:{
                        message: "La carpeta no se pudo crear"
                    } 
                });
                
            }
        }
    }
}

const groupsController = new GroupsController();
export default groupsController;