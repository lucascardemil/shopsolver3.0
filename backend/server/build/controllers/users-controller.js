"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
var bcrypt = require('bcryptjs');
class UsersController {
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.default.query('SELECT * FROM users');
            res.json(users);
        });
    }
    one(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
            if (user.length > 0) {
                return res.json(user[0]);
            }
            res.status(404).json({ message: "El usuario no existe" });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, password } = req.body;
            if (user == "") {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "El usuario es requerido"
                    }
                });
            }
            if (password == "") {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La contraseña es requerida"
                    }
                });
            }
            else {
                const user_exist = yield database_1.default.query('SELECT * FROM users WHERE user = ?', [user]);
                if (!user_exist || !(yield bcrypt.compare(password, user_exist[0].token))) {
                    return res.status(200).json({
                        status: "error",
                        result: {
                            message: "El usuario no existe"
                        }
                    });
                }
                else {
                    const token = jwt.sign({ sub: user_exist[0].id }, config_1.default.jwtSecret, { expiresIn: '7d' });
                    return res.status(200).json({
                        status: "ok",
                        result: {
                            user: user_exist[0].user,
                            token: token
                        }
                    });
                }
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.password) {
                req.body.token = yield bcrypt.hash(req.body.password, 10);
            }
            yield database_1.default.query('INSERT INTO users set ?', [req.body]);
            res.json({ message: 'Usuario guardado' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE users SET ? WHERE id = ?', [req.body, id]);
            res.json({ message: 'Usuario actualizado' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('DELETE FROM users WHERE id = ?', [id]);
            res.json({ message: 'Usuario fue eliminado' });
        });
    }
}
const usersController = new UsersController();
exports.default = usersController;
