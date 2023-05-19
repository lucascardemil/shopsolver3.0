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
class GroupsController {
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = yield database_1.default.query('SELECT * FROM groups_shopsolver');
            res.json(groups);
        });
    }
    one(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const group = yield database_1.default.query('SELECT * FROM groups_shopsolver WHERE id = ?', [id]);
            if (group.length > 0) {
                return res.status(200).json(group[0]);
            }
            else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La carpeta no existe"
                    }
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const images = yield database_1.default.query('SELECT * FROM photos_shopsolver WHERE id_group = ?', [id]);
            if (images.length > 0) {
                images.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    const filePath = '..\\..\\src' + element.image;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    // fs.unlinkSync('..\\..\\src' + element.image);
                    const groups = yield database_1.default.query('DELETE FROM photos_shopsolver WHERE id = ?', [element.id]);
                    if (groups) {
                        return res.status(200).json({
                            status: "ok",
                            result: {
                                message: "La carpeta fue eliminada!"
                            }
                        });
                    }
                    else {
                        return res.status(200).json({
                            status: "error",
                            result: {
                                message: "La carpeta no se elimino!"
                            }
                        });
                    }
                }));
            }
            const groups = yield database_1.default.query('DELETE FROM groups_shopsolver WHERE id = ?', [id]);
            if (groups) {
                return res.status(200).json({
                    status: "ok",
                    result: {
                        message: "La carpeta fue eliminada!"
                    }
                });
            }
            else {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "La carpeta no se elimino!"
                    }
                });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            if (name == "") {
                return res.status(200).json({
                    status: "error",
                    result: {
                        message: "El nombre es requerido"
                    }
                });
            }
            else {
                const groups = yield database_1.default.query('INSERT INTO groups_shopsolver set ?', [req.body]);
                if (groups) {
                    return res.status(200).json({
                        status: "ok",
                        result: {
                            message: "La carpeta se creo correctamente"
                        }
                    });
                }
                else {
                    return res.status(200).json({
                        status: "error",
                        result: {
                            message: "La carpeta no se pudo crear"
                        }
                    });
                }
            }
        });
    }
}
const groupsController = new GroupsController();
exports.default = groupsController;
