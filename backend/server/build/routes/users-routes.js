"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users-controller"));
class UsersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', users_controller_1.default.all);
        this.router.get('/:id', users_controller_1.default.one);
        this.router.post('/login', users_controller_1.default.login);
        this.router.post('/register', users_controller_1.default.create);
        this.router.delete('/:id', users_controller_1.default.delete);
        this.router.put('/:id', users_controller_1.default.update);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
