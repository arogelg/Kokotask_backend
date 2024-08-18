"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const user_1 = __importDefault(require("../models/user"));
const project_1 = __importDefault(require("../models/project"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        //find User
        const user = await user_1.default.findOne({ email }).select('id email name');
        if (!user) {
            const error = new Error('User not found');
            return res.status(404).json({ error: error.message });
        }
        res.json(user);
    };
    static getProjectTeam = async (req, res) => {
        const project = await project_1.default.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        });
        res.json(project.team);
    };
    static addMemberByID = async (req, res) => {
        const { id } = req.body;
        //find User
        const user = await user_1.default.findById(id).select('id');
        if (!user) {
            const error = new Error('User not found');
            return res.status(404).json({ error: error.message });
        }
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already in team');
            return res.status(409).json({ error: error.message });
        }
        req.project.team.push(user.id);
        await req.project.save();
        res.send('User added correctly');
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        if (!req.project.team.some(team => team.toString() === userId.toString())) {
            const error = new Error('User not in team');
            return res.status(409).json({ error: error.message });
        }
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId.toString());
        await req.project.save();
        res.send('User removed successfully');
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map