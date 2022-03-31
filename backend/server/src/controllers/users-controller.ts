import {Request, Response} from 'express';
import pool from '../database';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';


var bcrypt = require('bcryptjs');

class UsersController {
    public async all (req: Request, res: Response){
        const users = await pool.query('SELECT * FROM users');
        res.json(users);
    }


    public async one (req: Request, res: Response){
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (user.length > 0){
            return res.json(user[0]);
        }
        res.status(404).json({message: "El usuario no existe"});
    }

    public async login (req: Request, res: Response){
        const { user, password } = req.body;

        if(user == "") {
            return res.status(200).json({
                status: "error",
                result:{
                    message: "El usuario es requerido"
                }
            });
        }if(password == "") {
            return res.status(200).json({
                status: "error",
                result: {
                    message: "La contraseña es requerida"
                }
            });
        }else{

            const user_exist = await pool.query('SELECT * FROM users WHERE user = ?', [user]);

            if (!user_exist || !(await bcrypt.compare(password, user_exist[0].token))){
                return res.status(200).json({ 
                    status: "error",
                    result:{
                        message: "El usuario no existe"
                    } 
                });
            }else{
                const token = jwt.sign({ sub: user_exist[0].id }, config.jwtSecret, { expiresIn: '7d' });
                return res.status(200).json({
                    status: "ok",
                    result: {
                        user: user_exist[0].user,
                        token: token
                    } 
                });
            }

        }
    }


    public async create (req: Request, res: Response){
        
        if (req.body.password) {
            req.body.token = await bcrypt.hash(req.body.password, 10);
        }

        await pool.query('INSERT INTO users set ?', [req.body]);
        res.json({message: 'Usuario guardado'});
    }

    public async update (req: Request, res: Response){
        const { id } = req.params;
        await pool.query('UPDATE users SET ? WHERE id = ?', [req.body, id]);
        res.json({message: 'Usuario actualizado'});
    }

    public async delete (req: Request, res: Response){
        const { id } = req.params;
        const user = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({message: 'Usuario fue eliminado'});
    }
    
    
}



const usersController = new UsersController();
export default usersController;