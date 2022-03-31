"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groups_controller_1 = __importDefault(require("../controllers/groups-controller"));
class GroupsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/register', groups_controller_1.default.create);
        this.router.delete('/:id', groups_controller_1.default.delete);
        this.router.get('/', groups_controller_1.default.all);
        this.router.get('/:id', groups_controller_1.default.one);
    }
}
const groupsRoutes = new GroupsRoutes();
exports.default = groupsRoutes.router;
