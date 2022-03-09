import {Request, Response} from 'express';
import pool from '../database';
import * as jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import config from '../config/config';

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
            res.json({message: "El usuario es requerido"});
        }if(password == "") {
            res.json({message: "La contraseña es requerida"});
        }else{
            const users = await pool.query('SELECT * FROM users WHERE user = ? AND password = ?' , [user, password]);
            if (users.length > 0){
                const token = jwt.sign({ userId: users[0].id, username: users[0].user }, config.jwtSecret, { expiresIn: '1h' });
                res.json({signed_user: users[0].user, token: token});
            }else{
                res.json({message: "El usuario no existe"});
            }
        }
    }


    public async create (req: Request, res: Response){
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

    public getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch(Error) {
            return null;
        }
    }
    
}

const usersController = new UsersController();
export default usersController;