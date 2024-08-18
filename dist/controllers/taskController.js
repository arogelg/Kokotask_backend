"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_1 = __importDefault(require("../models/task"));
class TaskController {
    static createTask = async (req, res) => {
        try {
            const task = new task_1.default(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]);
            res.send('Task created successfully');
        }
        catch (error) {
            console.log(error.message);
        }
    };
    static getProjectTasks = async (req, res) => {
        try {
            const tasks = await task_1.default.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static getTaskById = async (req, res) => {
        try {
            const task = await (await (await task_1.default.findById(req.task.id))
                .populate({ path: 'completedBy.user', select: 'id name email' }))
                .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } });
            res.json(task);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updateTask = async (req, res) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save();
            res.send("Task updated successfully");
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static deleteTask = async (req, res) => {
        try {
            req.project.tasks = req.project.tasks.filter((task) => task.toString() !== req.task.id.toString());
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
            res.send('Task deleted successfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updateTaskStatus = async (req, res) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user.id,
                status
            };
            req.task.completedBy.push(data);
            await req.task.save();
            res.send('Task status updated successfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
}
exports.TaskController = TaskController;
//# sourceMappingURL=taskController.js.map