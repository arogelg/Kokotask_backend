"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectExists = projectExists;
const project_1 = __importDefault(require("../models/project"));
async function projectExists(req, res, next) {
    try {
        const { projectId } = req.params;
        const project = await project_1.default.findById(projectId);
        if (!project) {
            const error = new Error('Project not found');
            return res.status(404).json({ error: error.message });
        }
        req.project = project;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'There was an error' });
    }
}
//# sourceMappingURL=project.js.map